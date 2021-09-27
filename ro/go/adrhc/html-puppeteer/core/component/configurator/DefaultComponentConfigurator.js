import ComponentConfigurator from "./ComponentConfigurator.js";
import ValueStateInitializer from "../state-initializer/ValueStateInitializer.js";
import {dataOf, idOf} from "../../../util/DomUtils.js";
import PartialStateHolder from "../../state/PartialStateHolder.js";
import StateChangesHandlersInvoker from "../../state-processor/StateChangesHandlersInvoker.js";
import SimpleEventsBinder from "../events-binder/SimpleEventsBinder.js";

export default class DefaultComponentConfigurator extends ComponentConfigurator {
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
        component.id = idOf(this.config.elemIdOrJQuery);
        component.parent = this.config.parent;
        component.stateHolder = this.config.stateHolder ?? new PartialStateHolder(this.config);
        component.stateChangesHandlersInvoker =
            this.config.stateChangesHandlersInvoker ?? new StateChangesHandlersInvoker(this.config);
        this._setAndConfigureStateInitializer(component);
        this._setAndConfigureEventsBinder(component);
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
     * @protected
     */
    _setAndConfigureEventsBinder(component) {
        component.eventsBinder = this.config.eventsBinder ?? new SimpleEventsBinder(component);
        if (component.eventsBinder) {
            component.eventsBinder.component = component;
        }
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _setAndConfigureStateInitializer(component) {
        component.stateInitializer = this.config.stateInitializer;
        if (component.stateInitializer != null) {
            return;
        }
        // determine the parent's part to use to initialize component
        // config.part is taken from data-part (see GlobalConfig.DATA_PART)
        const partName = component.config.part;
        const parentState = component.parent?.getState();
        const partValue = partName ? parentState?.[partName] : undefined;
        // initialState priority: options.initialState, data-part, data-initial-state
        const initialState = this.options.initialState ?? partValue ?? this.dataAttributes.initialState;
        if (initialState != null) {
            component.stateInitializer = new ValueStateInitializer(initialState);
        }
    }
}
