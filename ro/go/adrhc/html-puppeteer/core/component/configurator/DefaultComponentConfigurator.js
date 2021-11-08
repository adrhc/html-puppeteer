import ComponentConfigurator from "./ComponentConfigurator.js";
import ValueStateInitializer from "../state-initializer/ValueStateInitializer.js";
import {dataOf, idOf} from "../../../util/DomUtils.js";
import {stateChangesHandlersInvokerOf} from "../../state-processor/StateChangesHandlersInvoker.js";
import {uniqueId} from "../../../util/StringUtils.js";
import ChildStateInitializer from "../state-initializer/ChildStateInitializer.js";
import StateHolder from "../../state/StateHolder.js";
import {StateProcessor} from "../../state-processor/StateProcessor.js";
import {eventsBinderGroupOf} from "../events-binder/EventsBinderGroup.js";

export default class DefaultComponentConfigurator extends ComponentConfigurator {
    /**
     * @type {ComponentConfigField}
     */
    config;
    /**
     * @type {DataAttributes}
     */
    dataAttributes;
    /**
     * @type {AbstractComponentOptions}
     */
    options;

    /**
     * @param {AbstractComponentOptions} options
     */
    constructor(options = {}) {
        super();
        this.options = options;
        this.dataAttributes = dataOf(this.options.elemIdOrJQuery) ?? {};
        this.config = _.defaults({}, this.options, this.dataAttributes);
    }

    /**
     * Sets the component's fields (e.g. stateHolder) to sensible defaults.
     *
     * @param {AbstractComponent} component
     */
    configure(component) {
        this._setOptionsDataAttributesAndConfig(component);
        component.id = idOf(this.config.elemIdOrJQuery) ?? newIdOf(this.config);
        component.parent = this.config.parent;
        component.stateProcessor = this._createStateProcessor(component);
        component.eventsBinder = eventsBinderGroupOf(this.config.eventsBinderProviders, component);
        component.stateInitializer = this.config.stateInitializer ?? this._createStateInitializer(component);
    }

    /**
     * @return {StateProcessor}
     * @protected
     */
    _createStateProcessor(component) {
        const stateHolder = this.config.stateHolderProvider?.(this.config) ?? new StateHolder(this.config);
        const stateChangesHandlersInvoker =
            this.config.stateChangesHandlersInvoker ?? stateChangesHandlersInvokerOf(component);
        return new StateProcessor(stateHolder, stateChangesHandlersInvoker);
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _setOptionsDataAttributesAndConfig(component) {
        component.dataAttributes = this.dataAttributes;
        component.options = this.options;
        component.config = this.config;
    }

    /**
     * @param {AbstractComponent} component
     * @return {StateInitializer}
     * @protected
     */
    _createStateInitializer(component) {
        if (component.partName != null) {
            return new ChildStateInitializer(this.config.initialState);
        } else if (this.config.initialState != null) {
            return new ValueStateInitializer(this.config.initialState);
        }
    }
}

/**
 * @param {ComponentConfigField} componentConfig
 */
export function newIdOf(componentConfig) {
    return newIdImpl(componentConfig?.part, componentConfig?.parent?.id)
}

/**
 * @param {string} partName
 * @param {string} parentId
 */
export function newIdImpl(partName, parentId) {
    return uniqueId(partName == null ? undefined : `${parentId}-${partName}`)
}

/**
 * @param {Object} options
 * @param {string} key
 * @return {*}
 */
export function configOf(options, key) {
    return options[key] ?? dataOf(options.elemIdOrJQuery, key);
}
