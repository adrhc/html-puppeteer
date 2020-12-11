class SelectableStateChange extends CrudStateChange {
    /**
     * @param item {IdentifiableEntity}
     * @param position {number}
     * @param crudOperation {"CREATE"|"UPDATE"|"DELETE"|undefined}
     * @param isSelected {boolean|undefined}
     */
    constructor(item, position, {crudOperation, isSelected}) {
        super(item, position, crudOperation);
        this.isSelected = isSelected;
    }
}