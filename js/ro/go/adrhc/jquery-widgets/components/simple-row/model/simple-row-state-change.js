class SimpleRowStateChange extends StateChange {
    constructor(previousRowState, updatedRowState) {
        super(undefined, {previousRowState, updatedRowState});
    }
}