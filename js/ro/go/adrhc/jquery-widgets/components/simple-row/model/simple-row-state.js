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
     */
    update(updatedRowState, requestType = "UPDATE", afterItemId) {
        this.collectStateChange(new PositionStateChange(requestType, updatedRowState, afterItemId));
    }

    collectStateChange(stateChange) {
        this.rowState = stateChange.data;
        super.collectStateChange(stateChange);
    }

    reset() {
        super.reset();
        this.rowState = undefined;
    }

    get currentState() {
        return this.rowState;
    }
}