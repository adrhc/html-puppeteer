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
     * @return {SCT}
     */
    getMutableState() {
        return this.stateHolder.mutableState;
    }

    /**
     * @return {SCT}
     */
    getStateCopy() {
        return this.stateHolder.stateCopy;
    }

    /**
     * @return {boolean}
     */
    stateIsEmpty() {
        return this.stateHolder.isEmpty();
    }

    /**
     * Offers the state for manipulation then execute the state changes handlers.
     *
     * @param {StateUpdaterFn} stateUpdaterFn
     */
    doWithState(stateUpdaterFn) {
        stateUpdaterFn(this.stateHolder);
        this.stateChangesHandlersInvoker.processStateChanges(this.stateHolder.stateChangesCollector);
    }

    /**
     * @param {StateChangesHandler} stateChangesHandlers
     */
    appendStateChangesHandlers(...stateChangesHandlers) {
        this.stateChangesHandlersInvoker.appendStateChangesHandlers(...stateChangesHandlers);
    }
}
