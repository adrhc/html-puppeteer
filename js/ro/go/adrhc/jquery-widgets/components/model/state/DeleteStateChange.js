class DeleteStateChange extends StateChange {
    constructor(partialOrEntireState, partName) {
        super("DELETE", partialOrEntireState, partName);
    }
}