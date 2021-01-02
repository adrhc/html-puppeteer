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
        this.rowState = updatedRowState;
        this.collectStateChange(new PositionStateChange(requestType, updatedRowState, afterItemId));
    }
}