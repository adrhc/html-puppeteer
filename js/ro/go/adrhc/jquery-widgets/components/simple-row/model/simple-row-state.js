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
     * @param requestType {"CREATE"|"DELETE"|"UPDATE"|undefined}
     * @param afterItemId {number|string}
     */
    update(updatedRowState, requestType, afterItemId) {
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
}