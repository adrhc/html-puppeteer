class StateChange {
    /**
     * @param item {IdentifiableEntity}
     * @param position {number}
     * @param crudOperation {"CREATE"|"UPDATE"|"DELETE"|undefined}
     * @param isSelected {boolean|undefined}
     */
    constructor(item, position, {crudOperation, isSelected}) {
        this.item = item;
        this.position = position;
        this.crudOperation = crudOperation;
        this.isSelected = isSelected;
    }
}