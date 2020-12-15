class SimpleRowStateChange extends StateChange {
    /**
     * @param previousRowState
     * @param updatedRowState
     * @param updatedRowStateIsDueToRemove
     */
    constructor(previousRowState, updatedRowState, updatedRowStateIsDueToRemove) {
        super(undefined, {previousRowState, updatedRowState, updatedRowStateIsDueToRemove});
    }
}