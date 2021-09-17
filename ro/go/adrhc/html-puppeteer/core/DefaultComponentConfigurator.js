import ComponentConfigurator from "./ComponentConfigurator.js";
import StateHolder from "./StateHolder.js";
import StateChangesHandlerAdapter from "./StateChangesHandlerAdapter.js";
import ValuesStateInitializer from "./ValuesStateInitializer.js";
import {dataOf} from "../util/DomUtils.js";
import {coalesce} from "../util/ObjectUtils.js";

/**
 * @typedef {{[key: string]: string|number|boolean}} DataAttributes
 */
export default class DefaultComponentConfigurator extends ComponentConfigurator {
    /**
     * @type {DataAttributes}
     */
    dataAttributes;
    /**
     * @type {AbstractComponentOptionsWithConfigurator}
     */
    options;

    /**
     * @param {AbstractComponentOptionsWithConfigurator} options
     */
    constructor(options = {}) {
        super();
        this.options = options;
        this.dataAttributes = dataOf(this.options.elemIdOrJQuery) ?? {};
        this.config = coalesce(this.dataAttributes, this.options);
    }

    /**
     * Sets the component's fields (e.g. stateHolder) to sensible defaults.
     *
     * @param {AbstractComponent} component
     */
    configure(component) {
        component.dataAttributes = this.dataAttributes;
        component.options = this.options;
        component.config = this.config;
        component.stateHolder = this.config.stateHolder ?? new StateHolder(this.config);
        component.stateChangesHandlerAdapter =
            this.config.stateChangesHandlerAdapter ?? new StateChangesHandlerAdapter(this.config);
        component.stateInitializer = this.config.stateInitializer ?? this._createStateInitializer();
        this._setAndConfigureEventsBinder(component);
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _setAndConfigureEventsBinder(component) {
        component.eventsBinder = this.config.eventsBinder;
        if (component.eventsBinder) {
            component.eventsBinder.component = component;
        }
    }

    /**
     * @return {StateInitializer}
     * @protected
     */
    _createStateInitializer() {
        const initialState = this.config.initialState;
        return initialState != null ? new ValuesStateInitializer(initialState) : undefined;
    }
}
