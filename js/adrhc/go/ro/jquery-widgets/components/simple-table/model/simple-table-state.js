class SimpleTableState {
    items = undefined;

    /**
     * @param items {IdentifiableEntity}
     */
    init(items) {
        this.items = items;
    }

    /**
     * @param id {number}
     * @return {IdentifiableEntity}
     */
    getItemById(id) {
        return EntityUtils.prototype.findById(id, this.items)
    }

    /**
     * @param id {number}
     * @return {boolean}
     */
    isTransientId(id) {
        return EntityUtils.prototype.isTransientId(id);
    }

    /**
     * @param append {boolean}
     * @return {IdentifiableEntity}
     */
    createNewItem(append) {
        const item = EntityUtils.prototype.newIdentifiableEntity();
        if (append) {
            this.items.push(item);
        } else {
            this.items.unshift(item);
        }
        return item;
    }

    /**
     * @param item {IdentifiableEntity}
     * @param position {number}
     */
    insertItem(item, position = 0) {
        ArrayUtils.prototype.insert(item, position, this.items)
    }

    /**
     * @param item {IdentifiableEntity}
     * @return item index
     */
    replaceItem(item) {
        return EntityUtils.prototype.findAndReplaceById(item, this.items);
    }

    /**
     * @return {number|number[]} removed positions (aka removed indexes)
     */
    removeTransientItem() {
        return EntityUtils.prototype.removeTransient(this.items);
    }
}