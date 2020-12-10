class InMemoryTableEditorRepository extends TableEditorRepository {
    constructor(items) {
        super();
        if (items) {
            this.items = Converters.prototype.mapOfArray(items);
        } else {
            this.items = {};
        }
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    getAll() {
        return this._promiseOf(Object.values(this.items));
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    insert(item) {
        item.id = EntityUtils.prototype.generateId();
        return this.update(item);
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    update(item) {
        this.items[item.id] = this._itemOf(item);
        return this._promiseOf(item);
    }

    /**
     * @param itemOrItems {IdentifiableEntity|IdentifiableEntity[]}
     * @return {Promise<IdentifiableEntity|IdentifiableEntity[]>}
     * @private
     */
    _promiseOf(itemOrItems) {
        if ($.isArray(itemOrItems)) {
            return Promise.resolve($.extend(true, [], itemOrItems));
        } else {
            return Promise.resolve($.extend(true, this._itemOf(), itemOrItems));
        }
    }

    /**
     * @param data
     * @return {IdentifiableEntity}
     * @private
     */
    _itemOf(data) {
        if (data) {
            return $.extend(true, this.newItem(), data);
        } else {
            return this.newItem();
        }
    }

    /**
     * @return {IdentifiableEntity}
     */
    newItem() {
        return new IdentifiableEntity();
    }
}