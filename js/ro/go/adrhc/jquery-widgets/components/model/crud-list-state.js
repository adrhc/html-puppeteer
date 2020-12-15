class CrudListState extends SimpleListState {
    /**
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity}
     */
    createNewItem(append = false) {
        const item = EntityUtils.prototype.newIdentifiableEntity();
        return this.insertItem(item, append);
    }

    /**
     * @param item {IdentifiableEntity}
     * @param append {boolean|undefined}
     */
    insertItem(item, append = false) {
        if (append) {
            this.items.push(item);
        } else {
            this.items.unshift(item);
        }
        this.collectStateChange(new StateChange("CREATE", item));
        return item;
    }

    /**
     * @param item {IdentifiableEntity}
     */
    updateItem(item) {
        EntityUtils.prototype.findAndReplaceById(item, this.items);
        this.collectStateChange(new StateChange("UPDATE", item));
    }

    /**
     * @param {number|string} id
     * @return {IdentifiableEntity}
     */
    removeById(id) {
        const removedItem = EntityUtils.prototype.removeById(id, this.items);
        this.collectStateChange(new StateChange("DELETE", removedItem));
        return removedItem;
    }

    /**
     * @return {number|number[]} removed positions (aka indexes)
     */
    removeTransient() {
        const removedItems = EntityUtils.prototype.removeTransient(this.items);
        this.collectStateChange(new StateChange("DELETE", removedItems));
        return removedItems;
    }

    /**
     * @param id {number}
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.prototype.findById(id, this.items)
    }
}