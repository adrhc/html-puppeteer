/**
 * @typedef {IdentifiableEntity} TItem
 * @typedef {TItem[]} T
 * @typedef {EntityRow<TItem>} P
 * @typedef {T|P} StateOrPart
 * @extends {SimpleListState<T, P>}
 */
class CrudListState extends SimpleListState {
    /**
     * @type {function(): TItem}
     */
    newEntityFactoryFn;
    /**
     * whether to append or prepend new items
     *
     * @type {boolean}
     */
    append;

    /**
     * @param {T} [initialState]
     * @param {function(): TItem} [newEntityFactoryFn]
     * @param {boolean} [newItemsGoToTheEndOfTheList]
     * @param {TaggingStateChangeMapper<T>} [stateChangeMapper]
     * @param {StateChangesCollector<T>} [changeManager]
     */
    constructor({
                    initialState,
                    newEntityFactoryFn = () => new IdentifiableEntity(IdentifiableEntity.TRANSIENT_ID),
                    newItemsGoToTheEndOfTheList,
                    stateChangeMapper,
                    changeManager
                }) {
        super({initialState, stateChangeMapper, changeManager});
        this.newEntityFactoryFn = newEntityFactoryFn;
        this.append = newItemsGoToTheEndOfTheList;
    }

    /**
     * @param {number} index
     * @return {P|undefined}
     */
    getStatePart(index) {
        if (this.items == null || index >= this.items.length) {
            return undefined;
        }
        return new EntityRow(this.items[index], index);
    }

    /**
     * @param {P} newRowValues
     * @param {number} oldIndex
     * @return {boolean}
     * @protected
     */
    _currentStatePartEquals(newRowValues, oldIndex) {
        return newRowValues == null && this.items.length <= oldIndex ||
            newRowValues != null && this.items.length > oldIndex &&
            this.items.length > newRowValues.index &&
            this.items[oldIndex] === newRowValues.entity &&
            newRowValues.index === oldIndex;
    }

    /**
     * @param {P} newRowValues
     * @param {number} oldIndex
     * @return {P} previous state part
     * @protected
     */
    _replacePartImpl(newRowValues, oldIndex) {
        const oldRowValues = this.getStatePart(oldIndex);
        if (oldRowValues == null) {
            if (newRowValues == null) {
                // both old and new item are null, nothing else to do
                return oldRowValues;
            }
            // old item doesn't exists, inserting the new one
            ArrayUtils.insert(newRowValues.entity, newRowValues.index, this.items);
        } else if (newRowValues == null) {
            // old item exists but the new one is null (i.e. old is deleted)
            ArrayUtils.removeByIndex(oldIndex, this.items);
        } else if (newRowValues.index === oldIndex) {
            // the index is the same, only changing the value at that index
            this.items[oldIndex] = newRowValues.entity;
        } else {
            // both item's value and index changed
            ArrayUtils.removeByIndex(oldIndex, this.items);
            ArrayUtils.insert(newRowValues.entity, newRowValues.index, this.items);
        }
        return oldRowValues;
    }

    /**
     * must return the original item (the one stored in this.items) for the receiver to be able to change its id
     * risk: the item is also used with the collectStateChange; a change by the final receiver will impact this.items!
     *
     * @param {TItem} [initialValue]
     * @param {boolean} [append]
     * @return {TaggedStateChange<P>}
     */
    createNewItem(initialValue, append = this.append) {
        const item = this.newEntityFactoryFn();
        if (initialValue != null) {
            $.extend(item, initialValue);
        }
        return this.insertItem(item, append);
    }

    /**
     * @param item {TItem} is to insert if itemIdToRemove exists otherwise update
     * @param itemIdToRemove {number|string} is to remove if exists
     * @param append {boolean|undefined}
     * @return {TaggedStateChange<P>}
     */
    save(item, itemIdToRemove, append = this.append) {
        if (itemIdToRemove != null && !EntityUtils.idsAreEqual(item.id, itemIdToRemove)) {
            this.removeById(itemIdToRemove);
            return this.insertItem(item, append);
        } else {
            return this.updateItem(item);
        }
    }

    /**
     * @param {TItem} item
     * @param {boolean} [append]
     * @return {TaggedStateChange<P>}
     */
    insertItem(item, append = this.append) {
        const newItemIndex = append ? this.items.length : 0;
        return this._replaceItem(new EntityRow(item, newItemIndex));
    }

    /**
     * @param {TItem} item
     * @param {number} [newItemIndex]
     * @return {TaggedStateChange<P>}
     */
    updateItem(item, newItemIndex) {
        const oldIndex = this.findIndexById(item.id);
        return this._replaceItem(new EntityRow(item,
            newItemIndex == null ? oldIndex : newItemIndex), oldIndex);
    }

    /**
     * @return {TaggedStateChange<P>}
     */
    removeTransient() {
        return this.removeById(IdentifiableEntity.TRANSIENT_ID);
    }

    /**
     * @param {number|string} id
     * @return {TaggedStateChange<P>}
     */
    removeById(id) {
        const indexToRemove = this.findIndexById(id);
        return this._removeItem(indexToRemove);
    }

    /**
     * @param {number} index
     * @return {TaggedStateChange<P>}
     * @protected
     */
    _removeItem(index) {
        return this.replacePart(undefined, index);
    }

    /**
     * @param {P} rowValues
     * @param {number} [oldIndex]
     * @return {TaggedStateChange<P>}
     * @protected
     */
    _replaceItem(rowValues, oldIndex = rowValues == null ? undefined : rowValues.index) {
        return this.replacePart(rowValues, oldIndex);
    }

    /**
     * @param {number|string} id
     * @return {number}
     */
    findIndexById(id) {
        return EntityUtils.findIndexById(id, this.items);
    }
}