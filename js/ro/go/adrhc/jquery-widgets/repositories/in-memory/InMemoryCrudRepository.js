class InMemoryCrudRepository extends CrudRepository {
    /**
     * @type {function({}): {}}
     */
    requestConverter;
    /**
     * converts server's response
     *
     * @type {function({}): IdentifiableEntity}
     */
    responseConverter;

    /**
     * @param [items] {Array<IdentifiableEntity>}
     * @param [responseConverter] {function({}): IdentifiableEntity}
     * @param [requestConverter] {function({}): IdentifiableEntity}
     */
    constructor(items = [], responseConverter = IdentifiableEntity.entityConverter, requestConverter = IdentifiableEntity.entityConverter) {
        super();
        this.items = items;
        this.requestConverter = requestConverter;
        this.responseConverter = responseConverter;
    }

    /**
     * @param [item] {IdentifiableEntity}
     * @return {IdentifiableEntity}
     */
    createNewItem(item = new IdentifiableEntity()) {
        if (item.id == null) {
            item.id = EntityUtils.generateId();
        }
        const reqItem = this.requestConverter(item);
        this.items.unshift(reqItem);
        return this.responseConverter(reqItem);
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    findAll() {
        return Promise.resolve(this.items.map(item => this.responseConverter(item)));
    }

    delete(id) {
        const removedItem = EntityUtils.removeById(id, this.items);
        if (removedItem) {
            return Promise.resolve(removedItem);
        } else {
            return Promise.reject(new SimpleError(`Repository couldn't find the id ${id} to delete!`, "delete", id));
        }
    }

    /**
     * @param {number|string} id
     * @param {boolean} [dontUsePromise]
     * @return {Promise<IdentifiableEntity>|IdentifiableEntity}
     */
    getById(id, dontUsePromise) {
        const resultItem = this.responseConverter(EntityUtils.findById(id, this.items));
        if (dontUsePromise) {
            return resultItem;
        } else {
            return Promise.resolve(resultItem);
        }
    }

    /**
     * usually, after saving, the item is no longer used by the caller so I can store it directly into this.items
     *
     * @param item {IdentifiableEntity}
     * @param [dontUsePromise] {boolean}
     * @return {Promise<IdentifiableEntity>|IdentifiableEntity}
     */
    insert(item, dontUsePromise) {
        item.id = EntityUtils.generateId();
        const reqItem = this.requestConverter(item);
        this.items.unshift(reqItem);
        const respItem = this.responseConverter(reqItem);
        if (dontUsePromise) {
            return respItem;
        } else {
            return Promise.resolve(respItem);
        }
    }

    /**
     * usually, after saving, the item is no longer used by the caller so I can store it directly into this.items
     *
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    update(item) {
        const reqItem = this.requestConverter(item);
        const removedIndex = EntityUtils.findAndReplaceById(reqItem, this.items);
        if (removedIndex < 0) {
            return Promise.reject(new SimpleError("Repository couldn't find the item to update!", "update", item));
        } else {
            return Promise.resolve(this.responseConverter(reqItem));
        }
    }
}