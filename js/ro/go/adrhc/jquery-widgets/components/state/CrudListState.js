/**
 * https://github.com/google/closure-compiler/wiki/Generic-Types#inheritance-of-generic-types
 *
 * The type used for SimpleListState's generic parameter should in fact be TItem
 * but this would make difficult to use this.items so when dealing with state changes the state/part will
 * be considered TItem while when using this.items (e.g. for findById(it)) it'll
 * be used IdentifiableEntity (as the return type).
 *
 * @template E
 * @typedef {EntityRow<IdentifiableEntity<E>>} TItem
 * @extends {SimpleListState<TItem>}
 */
class CrudListState extends SimpleListState {
    /**
     * @type {function(): IdentifiableEntity<E>}
     */
    newEntityFactoryFn;
    /**
     * whether to append or prepend new items
     *
     * @type {boolean}
     */
    append;

    /**
     * @param {{initialState: undefined|TItem[], newEntityFactoryFn: (undefined|function(): IdentifiableEntity<E>), newItemsGoLast: undefined|boolean, stateChangeMapper: undefined|TaggingStateChangeMapper<TItem,TItem>, changesCollector: undefined|StateChangesCollector<TItem>=}} options
     */
    constructor({
                    initialState,
                    newEntityFactoryFn = () => new IdentifiableEntity(IdentifiableEntity.TRANSIENT_ID),
                    newItemsGoLast = false,
                    stateChangeMapper,
                    changeManager
                }) {
        super({initialState, stateChangeMapper, changeManager});
        this.newEntityFactoryFn = newEntityFactoryFn;
        this.append = newItemsGoLast;
    }

    /**
     * @param {TItem} newRowValues
     * @param {number} oldIndex
     * @return {boolean}
     * @protected
     */
    _areStatePartsEqual(newRowValues, oldIndex) {
        const isPrevNullOrMissing = oldIndex >= this.items.length ||
            oldIndex < this.items.length && this.items[oldIndex] == null;
        // both are null
        return newRowValues == null && isPrevNullOrMissing
            // both are not null
            || !isPrevNullOrMissing && newRowValues != null
            // both have same index
            && newRowValues.index === oldIndex &&
            // both have same entity
            this._areStatePartsDataEqual(newRowValues.entity, this.items[oldIndex].entity);
    }

    /**
     * @param {TItem} newRowValues
     * @param {number} previousIndex
     * @return {TItem} previous state part
     * @protected
     */
    _replacePartImpl(newRowValues, previousIndex) {
        const oldRowValues = this.getStatePart(previousIndex);
        if (oldRowValues == null) {
            if (newRowValues == null) {
                console.warn("both old and new items are null, nothing else to do");
                return oldRowValues;
            }
            // old item doesn't exists, inserting the new one
            this._insertEntityRow(newRowValues);
        } else if (newRowValues == null) {
            // old item exists but the new one is null (i.e. old is deleted)
            ArrayUtils.removeByIndex(previousIndex, this.items);
        } else if (newRowValues.index === previousIndex) {
            // the index is the same, only changing the value at that index
            this.items[previousIndex] = newRowValues.entity;
        } else {
            // both item's value and index changed
            ArrayUtils.removeByIndex(previousIndex, this.items);
            this._insertEntityRow(newRowValues);
        }
        return oldRowValues;
    }

    /**
     * @param {TItem=} previousStatePart
     * @param {TItem=} partialState
     * @param {string|number=} dueToChangePartName
     * @return {StateChange<TItem>|undefined}
     * @protected
     */
    _stateChangeOf(previousStatePart, partialState, dueToChangePartName) {
        AssertionUtils.isTrue(previousStatePart != null || partialState != null);
        const previousIndex = previousStatePart?.entity != null ? this.findIndexById(previousStatePart?.entity?.id) : undefined;
        const newIndex = partialState?.entity != null ? this.findIndexById(partialState?.entity?.id) : undefined;
        // dueToChangePartName would depend on previousStatePart if not empty and fallback to partialState
        // When partialState is empty than previousStatePart should not be empty.
        dueToChangePartName = dueToChangePartName ?? previousStatePart?.index ?? partialState?.index ?? previousIndex ?? newIndex;
        AssertionUtils.isNotNull(dueToChangePartName);
        return super._stateChangeOf(previousStatePart, partialState, dueToChangePartName);
    }

    /**
     * @param {number} index
     * @return {TItem|undefined}
     */
    getStatePart(index) {
        if (this.items == null || index < 0 || index >= this.items.length) {
            return undefined;
        }
        return this.items[index];
    }

    /**
     * The purpose of this method is to provide type checking and a default for oldIndex parameter.
     *
     * @param {TItem} rowValues
     * @param {number=} dueToChangePartName
     * @param {boolean=} dontRecordStateEvents
     * @return {TaggedStateChange<TItem> | boolean}
     * @protected
     */
    replacePart(rowValues, dueToChangePartName = rowValues.index, dontRecordStateEvents) {
        return super.replacePart(rowValues, dueToChangePartName, dontRecordStateEvents);
    }

    /**
     * @param {E} newEntity
     * @param {E} oldEntity
     * @return {boolean}
     * @protected
     */
    _areStatePartsDataEqual(newEntity, oldEntity) {
        return newEntity === oldEntity;
    }

    /**
     * @param {TItem} entityRow
     * @protected
     */
    _insertEntityRow(entityRow) {
        if (entityRow.index != null) {
            if (entityRow.index === PositionUtils.LAST_ELEMENT_INDEX) {
                this.items.push(entityRow.entity);
            } else {
                ArrayUtils.insert(entityRow.entity, entityRow.index, this.items);
            }
        } else if (entityRow.beforeRowId != null) {
            const index = this.findIndexById(entityRow.beforeRowId);
            ArrayUtils.insert(entityRow.entity, index, this.items);
        } else if (entityRow.afterRowId != null) {
            const index = this.findIndexById(entityRow.afterRowId);
            ArrayUtils.insert(entityRow.entity, index + 1, this.items);
        } else if (entityRow.append) {
            this.items.push(entityRow.entity);
        } else {
            ArrayUtils.insert(entityRow.entity, 0, this.items);
        }
        this._updatePositioningProperties(entityRow);
    }

    /**
     * @param {TItem} entityRow
     * @protected
     */
    _updatePositioningProperties(entityRow) {
        const index = this.indexOf(entityRow.entity);
        AssertionUtils.isTrue(entityRow.index == null
            || entityRow.index === PositionUtils.LAST_ELEMENT_INDEX || entityRow.index === index,
            `Bad index!\n${JSON.stringify(entityRow)}`);
        if (index === 0) {
            entityRow.append = false;
        } else if (index === this.items.length - 1) {
            entityRow.append = true;
        } else {
            /**
             * @type {IdentifiableEntity<E>}
             */
            const theJustAfterItem = this.items[index + 1];
            entityRow.beforeRowId = theJustAfterItem.id;
        }
        entityRow.index = index;
        AssertionUtils.isTrue(PositionUtils.arePositioningPropertiesValid(entityRow),
            `Inconsistent positioning properties!\n${JSON.stringify(entityRow)}`);
    }

    /**
     * Instantiate a new item initialized with "item" properties and insert
     * it into this.items or, if the item.id already exists, update the item.
     * If previousItemId is provided and differs than item.id than remove the previousItemId-item.
     *
     * Provide updateOptions only if wanting to change item's position.
     * Provide createOptions if wanting to change item's position or wanting to provide previousItemId.
     *
     * @param {IdentifiableEntity<E>} item
     * @param {{previousItemId?: number|string, index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}=} createOptions
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}=} updateOptions
     * @return {TaggedStateChange<TItem>}
     */
    createOrUpdate(item, createOptions = {}, updateOptions) {
        if (createOptions.previousItemId != null && !EntityUtils.idsAreEqual(item.id, createOptions.previousItemId)) {
            // item acquired a new id, removing the previous version having options.previousItemId
            this.removeById(createOptions.previousItemId);
        }
        if (this.findById(item.id)) {
            return this.updateItem(item, updateOptions);
        } else {
            return this.createNewItem(item, createOptions)
        }
    }

    /**
     * Insert the provided item (unique by id) into this.items.
     *
     * @param {IdentifiableEntity<E>} identifiableEntity
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     * @return {TaggedStateChange<TItem>}
     */
    insertItem(identifiableEntity, options = {}) {
        AssertionUtils.isFalse(identifiableEntity.id != null && !!this.findById(identifiableEntity.id),
            `Can't insert duplicated item (id = ${identifiableEntity.id})!`);
        options.append = options.append ?? this.append;
        return this.replacePart(new EntityRow(identifiableEntity, options));
    }

    /**
     * Instantiate a new item and insert it into this.items (by calling insertItem).
     *
     * @param {IdentifiableEntity<E>|undefined} [initialValue]
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     * @return {TaggedStateChange<TItem>}
     */
    createNewItem(initialValue, options = {}) {
        const item = this.newEntityFactoryFn();
        if (initialValue != null) {
            $.extend(item, initialValue);
        }
        return this.insertItem(item, options);
    }

    /**
     * Update the item having item.id changing its position with options.
     *
     * @param {IdentifiableEntity<E>} item
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     * @return {TaggedStateChange<TItem>}
     */
    updateItem(item, options = {}) {
        const currentIndex = this.findIndexById(item.id);
        AssertionUtils.isTrue(currentIndex !== -1, `Can't update missing item (id = ${item.id})!`);
        // when options.index is missing than the other positioning properties
        // must be valid otherwise keep the previous position (i.e. currentIndex)
        options.index = options.index ?? (PositionUtils.areAllButIndexValid(options) ? undefined : currentIndex);
        return this.replacePart(new EntityRow(item, options), currentIndex);
    }

    indexOf(item) {
        return this.items.indexOf(item);
    }

    /**
     * @return {TaggedStateChange<TItem>}
     */
    removeTransient() {
        return this.removeById(IdentifiableEntity.TRANSIENT_ID);
    }

    /**
     * @param {number|string} id
     * @return {TaggedStateChange<TItem> | boolean}
     */
    removeById(id) {
        const indexToRemove = this.findIndexById(id);
        return this._removeItem(indexToRemove);
    }

    /**
     * @param {number} index
     * @return {TaggedStateChange<TItem> | boolean}
     * @protected
     */
    _removeItem(index) {
        return this.replacePart(undefined, index);
    }

    /**
     * @param {number|string} id
     * @return {number}
     */
    findIndexById(id) {
        return EntityUtils.findIndexById(id, this.items);
    }

    /**
     * @param {string|number} id
     * @return {IdentifiableEntity<E>}
     */
    findById(id) {
        return EntityUtils.findById(id, this.items);
    }
}