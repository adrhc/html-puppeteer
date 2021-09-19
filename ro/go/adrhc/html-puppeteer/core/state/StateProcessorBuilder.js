import StateChangesHandlersInvoker from "../StateChangesHandlersInvoker.js";
import StateHolder from "../StateHolder.js";
import {StateProcessor} from "./StateProcessor.js";

/**
 * @typedef {Object} StateProcessorOptions
 * @property {StateHolder} stateHolder
 * @property {StateChangesHandlersInvoker} stateChangesHandlersInvoker
 */
/**
 * @typedef {StateProcessorOptions & StateHolderOptions & StateChangesHandlersInvokerOptions} StateProcessorBuilderOptions
 * @property {*=} initialState
 */
class StateProcessorBuilder {
    /**
     * @type {StateProcessorBuilderOptions}
     */
    _options;

    /**
     * @param {StateProcessorBuilderOptions} options
     * @constructor
     */
    constructor(options) {
        this._options = options;
    }

    /**
     * @return {StateProcessor}
     */
    build() {
        const stateChangesHandlersInvoker = new StateChangesHandlersInvoker(this._options);
        const stateHolder = new StateHolder(this._options);
        const stateProcessor = new StateProcessor(stateHolder, stateChangesHandlersInvoker);
        if (this._options.initialState != null) {
            stateProcessor.doWithState((sh) => sh.replace(this._options.initialState));
        }
        return stateProcessor;
    }
}

/**
 * @param {StateProcessorBuilderOptions} options
 * @return {StateProcessor}
 */
export function stateProcessorOf(options) {
    return new StateProcessorBuilder(options).build();
}
