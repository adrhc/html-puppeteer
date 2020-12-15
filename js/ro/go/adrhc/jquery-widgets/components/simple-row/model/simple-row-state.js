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
     * @param action {"CREATE"|"DELETE"|"UPDATE"|undefined}
     */
    update(updatedRowState, action) {
        this.rowState = updatedRowState;
        this.collectStateChange(new SimpleRowStateChange(updatedRowState, action));
    }
}