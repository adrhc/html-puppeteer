import StateChangesHandlersInvoker from "../StateChangesHandlersInvoker.js";
import StateHolder from "../StateHolder.js";
import {StateProcessor} from "./StateProcessor.js";

/**
 * @typedef {StateProcessorOptions & StateHolderOptions & StateChangesHandlersInvokerOptions} StateProcessorBuilderOptions
 * @property {AbstractComponent=} component
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
        const doWithStateFn = (stateUpdaterFn) => {
            stateUpdaterFn(stateHolder);
            stateChangesHandlersInvoker.processStateChanges(stateHolder.stateChangesCollector);
        };
        const doWithState = doWithStateFn.bind(this._options.component);
        if (this._options.initialState != null) {
            doWithState((sh) => sh.replace(this._options.initialState));
        }
        return new StateProcessor({stateHolder, stateChangesHandlersInvoker, doWithState});
    }
}

/**
 * @param {StateProcessorBuilderOptions} options
 * @return {StateProcessor}
 */
export function stateProcessorOf(options) {
    return new StateProcessorBuilder(options).build();
}
