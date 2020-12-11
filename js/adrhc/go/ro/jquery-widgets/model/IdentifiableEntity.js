class IdentifiableEntity {
    constructor(id) {
        this.id = id;
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {IdentifiableEntity}
     */
    clone(item) {
        return $.extend(true, new IdentifiableEntity(item.id), item);
    }
}