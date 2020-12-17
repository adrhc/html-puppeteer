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
     * @param itemIdToRemove {number|string}
     * @return {IdentifiableEntity}
     */
    removeThenCreate(item, itemIdToRemove) {
        if (itemIdToRemove && !EntityUtils.prototype.idsAreEqual(item.id, itemIdToRemove)) {
            this.removeById(itemIdToRemove);
            return this.insertItem(item);
        } else {
            return this.updateItem(item);
        }
    }

    /**
     * @param item {IdentifiableEntity}
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity}
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
     * @return {IdentifiableEntity}
     */
    updateItem(item) {
        EntityUtils.prototype.findAndReplaceById(item, this.items);
        this.collectStateChange(new StateChange("UPDATE", item));
        return item;
    }

    /**
     * @param id {number|string}
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
     * @param id {number|string}
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.prototype.findById(id, this.items)
    }
}