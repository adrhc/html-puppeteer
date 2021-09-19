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
     * @param {StateHolder} stateHolder
     * @param {StateChangesHandlersInvoker} stateChangesHandlersInvoker
     * @param {DoWithStateFn} doWithState
     * @constructor
     */
    constructor(stateHolder, stateChangesHandlersInvoker, doWithState) {
        this.stateHolder = stateHolder;
        this.stateChangesHandlersInvoker = stateChangesHandlersInvoker;
        this.doWithState = doWithState;
    }
}
