class InMemoryTableEditorRepository extends TableEditorRepository {
    constructor(items) {
        super();
        if (items) {
            this.items = this._mapOf(items);
        } else {
            this.items = {};
        }
    }

    /**
     * @param array {Array<IdentifiableEntity>}
     * @return {*}
     * @private
     */
    _mapOf(array) {
        return array.reduce((accumulator, curr) => ({...accumulator, [curr.id]: curr}), {});
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    getAll() {
        return this._promiseOf(Object.values(this.items));
    }

    insert(item) {
        item.id = EntityUtils.prototype.generateId();
        return this.update(item);
    }

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

    newItem() {
        return new IdentifiableEntity();
    }
}