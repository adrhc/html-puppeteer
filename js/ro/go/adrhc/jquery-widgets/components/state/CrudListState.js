/**
 * CrudListState extends PartialStateHolder extends SimpleListState extends TaggingStateHolder extends StateHolder
 *
 * https://github.com/google/closure-compiler/wiki/Generic-Types#inheritance-of-generic-types
 *
 * The type used for SimpleListState's generic parameter should in fact be TItem
 * but this would make difficult to use this.items so when dealing with state changes the state/part will
 * be considered TItem while when using this.items (e.g. for findById(it)) it'll
 * be used IdentifiableEntity (as the return type).
 *
 * @template E
 * @typedef {IdentifiableEntity<E>} TItem
 * @extends {PartialStateHolder<TItem>}
 */
class CrudListState extends PartialStateHolder {
    /**
     * whether to append or prepend new items
     *
     * @type {boolean}
     */
    append;
    /**
     * @type {function(): IdentifiableEntity<E>}
     */
    newEntityFactoryFn;

    /**
     * see Documenting a destructuring parameter at https://jsdoc.app/tags-param.html#parameters-with-properties
     *
     * @param {Object} options
     * @param {undefined|function(): IdentifiableEntity<E>} options.newEntityFactoryFn
     * @param {boolean} options.newItemsGoLast
     * @param {{}} partialStateHolderOptions
     */
    constructor({newEntityFactoryFn, newItemsGoLast, ...partialStateHolderOptions}) {
        super(partialStateHolderOptions);
        this.newEntityFactoryFn = newEntityFactoryFn ?? (() => new IdentifiableEntity(IdentifiableEntity.TRANSIENT_ID));
        this.append = newItemsGoLast;
    }

    /**
     * @param {string|number} partName
     * @return {TItem}
     * @protected
     */
    _getPartByName(partName) {
        return this.items[partName];
    }

    /**
     * @param {P} newPart
     * @param {number} newPartName
     * @param {number} previousPartName
     * @return {P} the previous part
     * @protected
     */
    _replacePart(newPart, newPartName, previousPartName) {
        AssertionUtils.isTrue(newPart == null && newPartName == null || newPart != null && newPartName != null);
        const previousItem = this.items[previousPartName];
        if (previousItem == null) {
            if (newPart == null) {
                console.warn("both old and new items are null, nothing else to do");
                return previousItem;
            }
            // old item doesn't exists, inserting the new one
            ArrayUtils.insert(newPart, newPartName, this.items);
        } else if (newPart == null) {
            // old item exists but the new one is null (i.e. old is deleted)
            ArrayUtils.removeByIndex(previousPartName, this.items);
        } else {
            // previousItem and newPart are not null
            ArrayUtils.removeByIndex(previousPartName, this.items);
            ArrayUtils.insert(newPart, newPartName, this.items);
        }
        return previousItem;
    }

    /**
     * Insert the provided item (unique by id) into this.items.
     * Positioning priority: index, append, this.append.
     *
     * @param {IdentifiableEntity<E>} identifiableEntity
     * @param {Object} position
     * @param {number=} position.index
     * @param {boolean=} position.append
     * @return {TaggedStateChange<TItem>}
     */
    insertItem(identifiableEntity, {index, append} = {}) {
        AssertionUtils.isFalse(identifiableEntity.id != null && !!this.findById(identifiableEntity.id),
            `Can't insert duplicated item (id = ${identifiableEntity.id})!`);
        return this.replaceStateOrPart(identifiableEntity, undefined,
            index ?? ((append ?? this.append) ? this.items.length : 0));
    }

    /**
     * Instantiate a new item and insert it into this.items (by calling insertItem).
     *
     * @param {IdentifiableEntity<E>|undefined} [initialValue]
     * @param {{index?: number, append?: boolean}} [position]
     * @return {TaggedStateChange<TItem>}
     */
    createNewItem(initialValue, position) {
        const item = this.newEntityFactoryFn();
        if (initialValue != null) {
            Object.assign(item, initialValue);
        }
        return this.insertItem(item, position);
    }

    /**
     * Positioning priority: index, append, current index, previous item's index (if identity is changed).
     *
     * @param {IdentifiableEntity<E>} identifiableEntity
     * @param {{index: number, append: boolean}=} position is the identifiableEntity new position (null for keeping the previous)
     * @param {string|number=} previousItemId
     * @return {TaggedStateChange<TItem>}
     */
    updateItem(identifiableEntity, position, previousItemId) {
        let previousIndex;
        let nextIndex;
        if (previousItemId == null) {
            // identity not changed
            AssertionUtils.isTrue(identifiableEntity !== null);
            previousIndex = this.findIndexById(identifiableEntity.id);
            nextIndex = this._newItemPositionOf(identifiableEntity.id, position);
        } else if (identifiableEntity != null) {
            // identity is changed if previousItemId !== identifiableEntity.id
            previousIndex = this.findIndexById(previousItemId);
            nextIndex = this._newItemPositionOf(previousItemId, position);
        } else {
            // new item is empty
            AssertionUtils.isNull(position);
            previousIndex = this.findIndexById(previousItemId);
        }
        return this.replaceStateOrPart(identifiableEntity, previousIndex, nextIndex);
    }

    /**
     * @param {string|number} id
     * @param {Object} position
     * @param {number=} position.index
     * @param {boolean=} position.append
     * @return {number|number|number}
     * @private
     */
    _newItemPositionOf(id, {index, append} = {}) {
        const newIndex = this.findIndexById(id);
        AssertionUtils.isTrue(newIndex !== -1, `Can't find item with id = ${id}!`);
        // nextIndex priority: index, append, current index
        return index ?? (append ? this.items.length : (append === false ? 0 : newIndex));
    }

    /**
     * @param {TItem} item
     * @param {number|string=} previousItemId
     * @param {{index: number, append: boolean}} position
     * @return {TaggedStateChange<TItem>}
     */
    createOrUpdate(item, previousItemId, position) {
        if (previousItemId != null || item?.id != null) {
            return this.updateItem(item, position, previousItemId);
        } else {
            return this.createNewItem(item, position)
        }
    }

    /**
     * @param {boolean=} dontRecordStateEvents
     * @return {TaggedStateChange<TItem> | boolean}
     */
    removeTransient(dontRecordStateEvents) {
        return this.removeById(IdentifiableEntity.TRANSIENT_ID, dontRecordStateEvents);
    }

    /**
     * @param {number|string} id
     * @param {boolean=} dontRecordStateEvents
     * @return {TaggedStateChange<TItem> | boolean}
     */
    removeById(id, dontRecordStateEvents) {
        const indexToRemove = this.findIndexById(id);
        return this.replaceStateOrPart(undefined, indexToRemove, undefined, dontRecordStateEvents);
    }

    /**
     * @param {number|string} id
     * @return {number}
     */
    findIndexById(id) {
        return this.items.findIndex((it) => EntityUtils.idsAreEqual(it.id, id));
    }

    /**
     * @param {string|number} id
     * @return {TItem}
     */
    findById(id) {
        return this.items.find((it) => EntityUtils.idsAreEqual(it.id, id));
    }
}