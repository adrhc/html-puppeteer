class InMemoryCrudRepository extends CrudRepository {
    /**
     * @param items {Array<IdentifiableEntity>}
     * @param entityHelper {EntityHelper}
     */
    constructor(entityHelper, items = []) {
        super();
        this.entityHelper = entityHelper;
        this.items = items;
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    getAll() {
        return Promise.resolve($.extend(true, [], this.items));
    }

    delete(id) {
        const removedItem = EntityUtils.prototype.removeById(id, this.items);
        if (removedItem) {
            return Promise.resolve(removedItem);
        } else {
            return Promise.reject(id);
        }
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    insert(item) {
        item.id = this.entityHelper.generateId();
        this.items.unshift(item);
        return Promise.resolve($.extend(true, new IdentifiableEntity(), item));
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    update(item) {
        const removedIndex = EntityUtils.prototype.findAndReplaceById(item, this.items);
        if (removedIndex < 0) {
            return Promise.reject(item);
        } else {
            return Promise.resolve($.extend(true, new IdentifiableEntity(), item));
        }
    }
}