class SimpleRowStateChange extends StateChange {
    /**
     * @param rowState
     * @param rowStateIsRemoved
     */
    constructor(rowState, rowStateIsRemoved) {
        super(undefined, {rowState, rowStateIsRemoved});
    }
}