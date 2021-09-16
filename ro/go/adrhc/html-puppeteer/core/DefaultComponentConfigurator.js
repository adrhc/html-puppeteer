import ComponentConfigurator from "./ComponentConfigurator.js";
import StateHolder from "./StateHolder.js";
import StateChangesHandlerAdapter from "./StateChangesHandlerAdapter.js";
import ValuesStateInitializer from "./ValuesStateInitializer.js";
import {dataOf} from "../util/DomUtils.js";

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
    }

    /**
     * Sets the component's fields (e.g. stateHolder) to sensible defaults.
     *
     * @param {AbstractComponent} component
     */
    _setComponentDefaults(component) {
        component.options = this.options;
        component.dataAttributes = this.dataAttributes;
        component.stateHolder = this.options.stateHolder ?? this._createStateHolder();
        component.stateChangesHandlerAdapter =
            this.options.stateChangesHandlerAdapter ?? this._createStateChangesHandlerAdapter();
        component.stateInitializer = this.options.stateInitializer ?? this._createStateInitializer();
    }

    /**
     * @return {StateHolder}
     * @protected
     */
    _createStateHolder() {
        return new StateHolder();
    }

    /**
     * @return {StateChangesHandlerAdapter}
     * @protected
     */
    _createStateChangesHandlerAdapter() {
        return new StateChangesHandlerAdapter(this.options);
    }

    /**
     * @return {StateInitializer}
     * @protected
     */
    _createStateInitializer() {
        const initialState = this.options.initialState ?? this.dataAttributes.state;
        return initialState != null ? new ValuesStateInitializer(initialState) : undefined;
    }
}
