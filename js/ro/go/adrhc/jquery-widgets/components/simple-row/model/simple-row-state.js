class SimpleRowState extends BasicState {
    /**
     * @param rowState {*}
     */
    constructor(rowState) {
        super();
        this.rowState = rowState;
    }

    /**
     * @param updatedRowState {*}
     * @param [requestType] {"CREATE"|"DELETE"|"UPDATE"}
     * @param [afterItemId] {number|string}
     * @param [dontRecordEvents] {boolean}
     */
    update(updatedRowState, requestType = "UPDATE", afterItemId, dontRecordEvents) {
        this.collectStateChange(new PositionStateChange(requestType, updatedRowState, afterItemId), dontRecordEvents);
    }

    /**
     * @param stateChange
     * @param [dontRecordEvents] {boolean}
     */
    collectStateChange(stateChange, dontRecordEvents) {
        this.rowState = stateChange.data;
        super.collectStateChange(stateChange, dontRecordEvents);
    }

    reset() {
        super.reset();
        this.rowState = undefined;
    }

    get currentState() {
        return this.rowState;
    }
}