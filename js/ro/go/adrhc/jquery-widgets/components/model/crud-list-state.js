class CrudListState extends SimpleListState {
    /**
     * whether to append or prepend new items
     *
     * @type {boolean|undefined}
     */
    append;

    /**
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity}
     */
    createNewItem(append = this.append) {
        const item = EntityUtils.prototype.newIdentifiableEntity();
        return this.insertItem(item, append);
    }

    /**
     * @param item {IdentifiableEntity} is to insert if itemIdToRemove exists otherwise update
     * @param itemIdToRemove {number|string} is to remove if exists
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity} the insert or update result
     */
    save(item, itemIdToRemove, append = this.append) {
        if (!!itemIdToRemove && !EntityUtils.prototype.idsAreEqual(item.id, itemIdToRemove)) {
            this.removeById(itemIdToRemove);
            return this.insertItem(item, append);
        } else {
            return this.updateItem(item);
        }
    }

    /**
     * @param item {IdentifiableEntity}
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity}
     */
    insertItem(item, append = this.append) {
        let afterItemId;
        if (append) {
            afterItemId = this.items.length ? this.items[this.items.length - 1].id : undefined;
            this.items.push(item);
        } else {
            this.items.unshift(item);
        }
        this.collectStateChange(new CreateStateChange(item, afterItemId));
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
     * @return {IdentifiableEntity|IdentifiableEntity[]} removed positions (aka indexes)
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