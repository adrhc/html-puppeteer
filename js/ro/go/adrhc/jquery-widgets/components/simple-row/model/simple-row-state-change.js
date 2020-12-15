class SimpleRowStateChange extends StateChange {
    /**
     * @param rowState
     * @param action {"CREATE"|"DELETE"|"UPDATE"}
     */
    constructor(rowState, action = "UPDATE") {
        super(undefined, {rowState, action});
    }
}