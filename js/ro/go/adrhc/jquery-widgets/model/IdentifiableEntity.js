class IdentifiableEntity {
    /**
     * @param id {number|string|undefined}
     */
    constructor(id) {
        /**
         * @type {number|undefined}
         */
        this.id = !!id ? +id : undefined;
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {IdentifiableEntity}
     */
    clone(item) {
        return $.extend(true, new IdentifiableEntity(item.id), item);
    }
}