import ComponentConfigurer from "./ComponentConfigurer";
import StateHolder from "./StateHolder.js";
import StateChangesHandlerAdapter from "./StateChangesHandlerAdapter.js";
import ValuesStateInitializer from "./ValuesStateInitializer.js";
/**
 * @typedef {Object} StateChangesHandlersOptions
 * @property {ComponentIllustrator} componentIllustrator
 * @property {PartsAllocator} partsAllocator
 * @property {StateChangesHandler[]} extraStateChangesHandlers
 */
/**
 * @typedef {Object} ComponentOptions
 * @property {StateHolder=} stateHolder
 * @property {StateInitializer=} stateInitializer
 * @property {*=} initialState
 * @property {StateChangesHandlerAdapter} stateChangesHandlerAdapter
 * @property {string=} allChangesMethod
 * @property {string=} allPartChangesMethod
 * @property {string=} partMethodPrefix
 * @property {StateChangesHandler[]} stateChangesHandlers
 * @property {StateChangesHandlersOptions} stateChangesHandlersOptions
 */
export default class DefaultComponentConfigurer extends ComponentConfigurer {
    /**
     * @type {ComponentOptions}
     */
    options;

    /**
     * @param {ComponentOptions} options
     */
    constructor(options) {
        super();
        this.options = options;
    }

    /**
     * @param {AbstractComponent} abstractComponent
     */
    _setComponentDefaults(abstractComponent) {
        abstractComponent.stateHolder = this.options.stateHolder ?? this._createStateHolder();
        abstractComponent.stateInitializer = this.options.stateInitializer ?? this._createStateInitializer();
        abstractComponent.stateChangesHandlerAdapter =
            this.options.stateChangesHandlerAdapter ?? this._createStateChangesHandlerAdapter();
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
        return this.options.initialState != null ? new ValuesStateInitializer(this.options.initialState) : undefined;
    }
}