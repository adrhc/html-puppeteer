import ComponentConfigurer from "./ComponentConfigurer.js";
import StateHolder from "./StateHolder.js";
import StateChangesHandlerAdapter from "./StateChangesHandlerAdapter.js";
import ValuesStateInitializer from "./ValuesStateInitializer.js";
import DomUtils from "../util/DomUtils.js";

/**
 * @typedef {{[key: string]: string|number|boolean}} DataAttributes
 */
export default class DefaultComponentConfigurer extends ComponentConfigurer {
    /**
     * @type {AbstractComponentOptions}
     */
    options;
    /**
     * @type {DataAttributes}
     */
    dataAttributes;

    /**
     * @param {AbstractComponentOptions} options
     */
    constructor(options) {
        super();
        this.options = options;
    }

    /**
     * @param {AbstractComponent} component
     */
    _setComponentDefaults(component) {
        this.dataAttributes = DomUtils.dataOf(this.options.elemIdOrJQuery);
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