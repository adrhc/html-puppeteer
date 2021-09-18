import StateChangesHandlersInvoker from "../StateChangesHandlersInvoker.js";
import StateHolder from "../StateHolder.js";

/**
 * @typedef {Object} StateProcessorOptions
 * @property {StateHolder} stateHolder
 * @property {StateChangesHandlersInvoker} stateChangesHandlersInvoker
 * @property {DoWithStateFn} doWithState
 */

/**
 * @typedef {function(stateUpdaterFn: function(state: StateHolder))} DoWithStateFn
 */
export class StateProcessor {
    /**
     * @type {DoWithStateFn}
     */
    doWithState;
    /**
     * @type {StateChangesHandlersInvoker}
     */
    stateChangesHandlersInvoker;
    /**
     * @type {StateHolder}
     */
    stateHolder;

    /**
     * @param {StateProcessorOptions} options
     */
    constructor({stateHolder, stateChangesHandlersInvoker, doWithState}) {
        this.stateHolder = stateHolder;
        this.stateChangesHandlersInvoker = stateChangesHandlersInvoker;
        this.doWithState = doWithState;
    }
}

/**
 * @typedef {StateProcessorOptions & StateHolderOptions & StateChangesHandlersInvokerOptions} StateProcessorOfOptions
 * @property {AbstractComponent=} component
 * @property {*=} initialState
 */

/**
 * This is a StateProcessor builder.
 *
 * @param {StateProcessorOfOptions} options
 * @param {StateProcessorOfOptions=} options.restOfOptions
 * @return {StateProcessor}
 */
export function stateProcessorOf({component, initialState, ...restOfOptions}) {
    const stateChangesHandlersInvoker = new StateChangesHandlersInvoker(restOfOptions);
    const stateHolder = new StateHolder(restOfOptions);
    const doWithStateFn = (stateUpdaterFn) => {
        stateUpdaterFn(stateHolder);
        stateChangesHandlersInvoker.processStateChanges(stateHolder.stateChangesCollector);
    };
    const doWithState = doWithStateFn.bind(component);
    if (initialState != null) {
        doWithState((sh) => sh.replace(initialState));
    }
    return new StateProcessor({stateHolder, stateChangesHandlersInvoker, doWithState});
}
