class DeleteStateChange extends StateChange {
    constructor(previousStateOrPart, partName) {
        super("DELETE", previousStateOrPart, undefined, partName);
    }
}