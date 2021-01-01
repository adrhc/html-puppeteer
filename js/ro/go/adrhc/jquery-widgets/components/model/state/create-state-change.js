class CreateStateChange extends StateChange {
    /**
     * @param item {IdentifiableEntity}
     * @param afterItemId {number|string}
     */
    constructor(item, afterItemId) {
        super("CREATE", item);
        this.afterItemId = afterItemId
    }
}