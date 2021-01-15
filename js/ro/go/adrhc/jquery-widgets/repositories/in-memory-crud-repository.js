class InMemoryCrudRepository extends CrudRepository {
    /**
     * @type {function(): IdentifiableEntity} create a new, pristine, IdentifiableEntity
     */
    entityFactoryFn;

    /**
     * @param items {Array<IdentifiableEntity>}
     * @param [entityFactoryFn] {function(): IdentifiableEntity}
     */
    constructor(items = [], entityFactoryFn = () => new IdentifiableEntity()) {
        super();
        this.items = items;
        this.entityFactoryFn = entityFactoryFn;
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    findAll() {
        return Promise.resolve(this.items.map(item => $.extend(true, this.entityFactoryFn(), item)));
    }

    delete(id) {
        const removedItem = EntityUtils.removeById(id, this.items);
        if (removedItem) {
            return Promise.resolve(removedItem);
        } else {
            return Promise.reject(`repository couldn't find id to delete: ${id}`);
        }
    }

    /**
     * @return {IdentifiableEntity}
     */
    createNewItem() {
        const identifiableEntity = this.entityFactoryFn();
        identifiableEntity.id = EntityUtils.generateId();
        this.items.unshift(identifiableEntity);
        return identifiableEntity;
    }

    /**
     * usually, after saving, the item is no longer used by the caller so I can store it directly into this.items
     *
     * @param item {IdentifiableEntity}
     * @param [dontUsePromise] {boolean}
     * @return {Promise<IdentifiableEntity>|IdentifiableEntity}
     */
    insert(item, dontUsePromise = false) {
        item.id = EntityUtils.generateId();
        this.items.unshift(item);
        const resultItem = $.extend(true, this.entityFactoryFn(), item);
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
        const removedIndex = EntityUtils.findAndReplaceById(item, this.items);
        if (removedIndex < 0) {
            return Promise.reject(`repository couldn't find item to update:\n${JSON.stringify(item)}`);
        } else {
            return Promise.resolve($.extend(true, this.entityFactoryFn(), item));
        }
    }
}