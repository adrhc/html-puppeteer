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
     * @param useNoPromise {boolean|undefined}
     * @return {Promise<IdentifiableEntity>|IdentifiableEntity}
     */
    insert(item, useNoPromise = false) {
        this.items.unshift(item);
        const resultItem = $.extend(true, new IdentifiableEntity(), item);
        resultItem.id = this.entityHelper.generateId();
        if (useNoPromise) {
            return resultItem;
        } else {
            return Promise.resolve(resultItem);
        }
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