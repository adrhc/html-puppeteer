/**
 * @typedef {function(state: StateHolder)} StateUpdaterFn
 */
export class StateProcessor {
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
     * @constructor
     */
    constructor(stateHolder, stateChangesHandlersInvoker) {
        this.stateHolder = stateHolder;
        this.stateChangesHandlersInvoker = stateChangesHandlersInvoker;
    }

    /**
     * Offers the state for manipulation then execute the state changes handlers.
     *
     * @return {[]}
     * @param {StateUpdaterFn} stateUpdaterFn
     */
    doWithState(stateUpdaterFn) {
        stateUpdaterFn(this.stateHolder);
        return this.stateChangesHandlersInvoker.processStateChanges(this.stateHolder.stateChangesCollector);
    }
}
