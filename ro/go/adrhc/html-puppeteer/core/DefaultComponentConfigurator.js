import ComponentConfigurator from "./ComponentConfigurator.js";
import StateHolder from "./StateHolder.js";
import StateChangesHandlerAdapter from "./StateChangesHandlerAdapter.js";
import ValuesStateInitializer from "./ValuesStateInitializer.js";
import {dataOf} from "../util/DomUtils.js";
import EventsBinder from "./EventsBinder.js";
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
    _setComponentDefaults(component) {
        component.dataAttributes = this.dataAttributes;
        component.options = this.options;
        component.config = this.config;
        component.stateHolder = this.config.stateHolder ?? this._createStateHolder();
        component.stateChangesHandlerAdapter =
            this.config.stateChangesHandlerAdapter ?? this._createStateChangesHandlerAdapter();
        component.stateInitializer = this.config.stateInitializer ?? this._createStateInitializer();
        component.eventsBinder = this.config.eventsBinder ?? this._createEventsBinder(component);
        component.eventsBinder.component = component;
    }

    /**
     * @param {AbstractComponent} component
     * @return {EventsBinder}
     * @protected
     */
    _createEventsBinder(component) {
        return new EventsBinder(component);
    }

    /**
     * @return {StateHolder}
     * @protected
     */
    _createStateHolder() {
        return new StateHolder(this.config);
    }

    /**
     * @return {StateChangesHandlerAdapter}
     * @protected
     */
    _createStateChangesHandlerAdapter() {
        return new StateChangesHandlerAdapter(this.config);
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
