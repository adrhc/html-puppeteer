/**
 * @typedef {function(stateUpdaterFn: function(state: StateHolder))} DoWithStateFn
 */
/**
 * @typedef {Object} StateProcessorOptions
 * @property {StateHolder} stateHolder
 * @property {StateChangesHandlersInvoker} stateChangesHandlersInvoker
 * @property {DoWithStateFn} doWithState
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
