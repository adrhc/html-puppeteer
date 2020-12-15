class SimpleRowState extends BasicState {
    /**
     * @param rowState {*}
     */
    constructor(rowState = undefined) {
        super();
        this.rowState = rowState;
    }

    /**
     * @param updatedRowState {*}
     * @param rowStateIsRemoved {boolean|undefined}
     */
    update(updatedRowState, rowStateIsRemoved) {
        this.rowState = updatedRowState;
        this.collectStateChange(new SimpleRowStateChange(updatedRowState, rowStateIsRemoved));
    }
}