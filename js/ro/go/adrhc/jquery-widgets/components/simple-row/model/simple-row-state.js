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
     */
    update(updatedRowState) {
        const previousRowState = this.rowState;
        this.rowState = updatedRowState;
        this.collectStateChange(new SimpleRowStateChange(previousRowState, updatedRowState));
    }
}