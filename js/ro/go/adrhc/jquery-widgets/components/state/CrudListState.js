class CrudListState extends TaggingStateHolder {
    /**
     * @type {function(): IdentifiableEntity}
     */
    newEntityFactoryFn;
    /**
     * whether to append or prepend new items
     *
     * @type {boolean}
     */
    append;
    /**
     * @type {string}
     */
    partName;

    /**
     * @param {*} [currentState]
     * @param {function(): IdentifiableEntity} [newEntityFactoryFn]
     * @param {boolean} [newItemsGoToTheEndOfTheList]
     * @param {string} [partName]
     * @param {StateChangesCollector} [changeManager]
     */
    constructor({
                    currentState,
                    newEntityFactoryFn = () => new IdentifiableEntity(IdentifiableEntity.TRANSIENT_ID),
                    newItemsGoToTheEndOfTheList,
                    partName = "ITEM",
                    changeManager
                }) {
        super(currentState, {changeManager});
        this.newEntityFactoryFn = newEntityFactoryFn;
        this.append = newItemsGoToTheEndOfTheList;
        this.partName = partName;
    }

    /**
     * must return the original item (the one stored in this.items) for the receiver to be able to change its id
     * risk: the item is also used with the collectStateChange; a change by the final receiver will impact this.items!
     *
     * @param [append] {boolean}
     * @return {IdentifiableEntity}
     */
    createNewItem(append = this.append) {
        const item = this.newEntityFactoryFn();
        return this.insertItem(item, append);
    }

    /**
     * @param item {IdentifiableEntity} is to insert if itemIdToRemove exists otherwise update
     * @param itemIdToRemove {number|string} is to remove if exists
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity} the insert or update result
     */
    save(item, itemIdToRemove, append = this.append) {
        if (!!itemIdToRemove && !EntityUtils.idsAreEqual(item.id, itemIdToRemove)) {
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
        this.collectStateChange(new PositionStateChange("CREATE",
            item, {afterItemId, partName: this.partName}), {});
        return item;
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {IdentifiableEntity}
     */
    updateItem(item) {
        EntityUtils.findAndReplaceById(item, this.items);
        this.patch(item, "REPLACE", this.partName);
        return item;
    }

    /**
     * @param id {number|string}
     * @return {IdentifiableEntity}
     */
    removeById(id) {
        const removedItem = EntityUtils.removeById(id, this.items);
        if (removedItem) {
            this.patch(removedItem, "DELETE", this.partName);
        } else {
            console.log(`item id ${id} is missing (already deleted by someone else)`)
        }
        return removedItem;
    }

    /**
     * @return {IdentifiableEntity|IdentifiableEntity[]} removed positions (aka indexes)
     */
    removeTransient() {
        const removedItems = EntityUtils.removeTransient(this.items);
        AssertionUtils.isFalse($.isArray(removedItems));
        this.patch(removedItems, "DELETE", this.partName);
        return removedItems;
    }

    /**
     * @param id {number|string}
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.findById(id, this.items)
    }
}