class InMemoryCrudRepository extends CrudRepository {
    /**
     * @type {function({}): IdentifiableEntity} creates a new, pristine, IdentifiableEntity
     */
    entityConverter;

    /**
     * @param items {Array<IdentifiableEntity>}
     * @param [entityConverter] {function({}): IdentifiableEntity}
     */
    constructor(items = [], entityConverter = IdentifiableEntity.entityConverter) {
        super();
        this.items = items;
        this.entityConverter = entityConverter;
    }

    /**
     * @param [item] {IdentifiableEntity}
     * @return {IdentifiableEntity}
     */
    createNewItem(item = new IdentifiableEntity()) {
        const identifiableEntity = this.entityConverter(item);
        if (identifiableEntity.id == null) {
            identifiableEntity.id = EntityUtils.generateId();
        }
        this.items.unshift(identifiableEntity);
        return identifiableEntity;
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    findAll() {
        return Promise.resolve(this.items.map(item => this.entityConverter(item)));
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
     * @param id {number|string}
     * @param [dontUsePromise] {boolean}
     * @return {Promise<IdentifiableEntity>|IdentifiableEntity}
     */
    getById(id, dontUsePromise) {
        const resultItem = this.entityConverter(EntityUtils.findById(id, this.items));
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
        if (item.firstName === "error") {
            return Promise.reject(new SimpleError("Salvarea datelor a eşuat!", "insert", item));
        }
        item.id = EntityUtils.generateId();
        this.items.unshift(item);
        const resultItem = this.entityConverter(item);
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
     * @return {Promise<IdentifiableEntity>}
     */
    update(item) {
        if (item.firstName === "error") {
            return Promise.reject(new SimpleError("Actualizarea datelor a eşuat!", "update", item));
        }
        const removedIndex = EntityUtils.findAndReplaceById(item, this.items);
        if (removedIndex < 0) {
            return Promise.reject(new SimpleError("Repository couldn't find the item to update!", "update", item));
        } else {
            return Promise.resolve(this.entityConverter(item));
        }
    }
}