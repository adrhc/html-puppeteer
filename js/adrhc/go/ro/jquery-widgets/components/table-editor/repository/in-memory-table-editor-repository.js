class InMemoryTableEditorRepository extends TableEditorRepository {
    /**
     * @param items {Array<IdentifiableEntity>}
     */
    constructor(items) {
        super();
        this.items = items;
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    getAll() {
        return Promise.resolve(this.items);
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    insert(item) {
        item.id = EntityUtils.prototype.generateId();
        this.items.unshift(item);
        return Promise.resolve(item);
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    update(item) {
        ArrayUtils.prototype.findAndReplaceByFilter(item,
            this.items, (it) => EntityUtils.prototype.haveSameId(it, item));
        return Promise.resolve(item);
    }
}