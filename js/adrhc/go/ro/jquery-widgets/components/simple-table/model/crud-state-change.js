class CrudStateChange {
    /**
     * @param item {IdentifiableEntity}
     * @param position {number}
     * @param crudOperation {"CREATE"|"UPDATE"|"DELETE"|undefined}
     */
    constructor(item, position, crudOperation) {
        this.item = item;
        this.position = position;
        this.crudOperation = crudOperation;
    }
}