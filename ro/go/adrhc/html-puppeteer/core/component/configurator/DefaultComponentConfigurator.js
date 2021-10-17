import ComponentConfigurator from "./ComponentConfigurator.js";
import ValueStateInitializer from "../state-initializer/ValueStateInitializer.js";
import {dataOf, idOf} from "../../../util/DomUtils.js";
import PartialStateHolder from "../../state/PartialStateHolder.js";
import StateChangesHandlersInvoker from "../../state-processor/StateChangesHandlersInvoker.js";
import {uniqueId} from "../../../util/StringUtils.js";
import ChildStateInitializer from "../state-initializer/ChildStateInitializer.js";

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
        component.stateHolder = this.config.stateHolder ?? new PartialStateHolder(this.config);
        component.stateChangesHandlersInvoker =
            this.config.stateChangesHandlersInvoker ?? new StateChangesHandlersInvoker(this.config);
        // very special case for eventsBinder: the provider has priority
        component.eventsBinder = this.config.eventsBinderProvider?.(component) ?? this.config.eventsBinder;
        component.stateInitializer = this.config.stateInitializer ?? this._createStateInitializer(component);
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