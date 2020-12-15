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
     */
    update(updatedRowState, requestType) {
        this.rowState = updatedRowState;
        this.collectStateChange(new StateChange(requestType, updatedRowState));
    }
}