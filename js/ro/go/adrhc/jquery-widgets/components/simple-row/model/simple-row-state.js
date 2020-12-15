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
     * @param rowStateIsCreated {boolean|undefined}
     */
    update(updatedRowState, {rowStateIsRemoved, rowStateIsCreated}) {
        this.rowState = updatedRowState;
        this.collectStateChange(new SimpleRowStateChange(updatedRowState, {rowStateIsRemoved, rowStateIsCreated}));
    }
}