class SimpleRowStateChange extends StateChange {
    /**
     * @param rowState
     * @param rowStateIsRemoved {boolean|undefined}
     * @param rowStateIsCreated {boolean|undefined}
     */
    constructor(rowState, {rowStateIsRemoved, rowStateIsCreated}) {
        super(undefined, {rowState, rowStateIsRemoved, rowStateIsCreated});
    }
}