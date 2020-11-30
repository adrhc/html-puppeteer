class StateChanges {
    constructor(prevRowState, newRowState, prevIsRemoved, newIsCreated) {
        this.prevRowState = prevRowState;
        this.newRowState = newRowState;
        this.prevIsRemoved = prevIsRemoved;
        this.newIsCreated = newIsCreated;
    }
}