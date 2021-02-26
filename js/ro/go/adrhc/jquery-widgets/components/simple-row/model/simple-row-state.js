class SimpleRowState extends BasicState {
    /**
     * @param rowState {*}
     */
    constructor(rowState) {
        super();
        this.currentState = rowState;
    }

    /**
     * @param updatedRowState {*}
     * @param [requestType] {"CREATE"|"DELETE"|"UPDATE"}
     * @param [afterItemId] {number|string}
     * @param [dontRecordStateEvents] {boolean}
     */
    update(updatedRowState, requestType = "UPDATE", afterItemId, dontRecordStateEvents) {
        this.collectStateChange(new PositionStateChange(requestType, updatedRowState, afterItemId), {dontRecordStateEvents});
    }

    /**
     * @param stateChange {StateChange}
     * @param {boolean} [dontRecordStateEvents]
     * @param {boolean} [overwriteState]
     */
    collectStateChange(stateChange, {dontRecordStateEvents, overwriteState = true}) {
        super.collectStateChange(stateChange, {dontRecordStateEvents, overwriteState});
    }

    get rowState() {
        return this.currentState;
    }

    set rowState(rowState) {
        this.currentState = rowState;
    }
}