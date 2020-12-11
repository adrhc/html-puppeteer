class InMemoryCrudRepository extends CrudRepository {
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
        return Promise.resolve($.extend(true, [], this.items));
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
        EntityUtils.prototype.findAndReplaceById(item, this.items);
        return Promise.resolve(item);
    }
}