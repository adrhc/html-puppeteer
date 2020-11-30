class StateChanges {
    constructor(prevItemState, newItemState, prevIsRemoved, newIsCreated) {
        this.prevTabularItemState = prevItemState;
        this.newTabularItemState = newItemState;
        this.prevIsRemoved = prevIsRemoved;
        this.newIsCreated = newIsCreated;
    }
}