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
     * see Documenting a destructuring parameter at https://jsdoc.app/tags-param.html#parameters-with-properties
     *
     * @param {Object} options
     * @param {undefined|function(): IdentifiableEntity<E>} options.newEntityFactoryFn
     * @param {undefined|boolean} options.newItemsGoLast
     * @param {{initialState: undefined|TItem[], stateChangeMapper: undefined|TaggingStateChangeMapper<TItem,TItem>, changesCollector: undefined|StateChangesCollector<TItem>=}} superOptions
     */
    constructor({newEntityFactoryFn, newItemsGoLast, ...superOptions}) {
        super(superOptions);
        this.newEntityFactoryFn = newEntityFactoryFn ?? (() => new IdentifiableEntity(IdentifiableEntity.TRANSIENT_ID));
        this.append = newItemsGoLast ?? false;
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
     * @param {TItem} entityRow
     * @param {number} previousIndex
     * @return {TItem} previous state part
     * @protected
     */
    _replacePartImpl(entityRow, previousIndex) {
        const oldRowValues = this.getStatePart(previousIndex);
        if (oldRowValues == null) {
            if (entityRow == null) {
                console.warn("both old and new items are null, nothing else to do");
                return oldRowValues;
            }
            // old item doesn't exists, inserting the new one
            this._insertEntityRow(entityRow);
        } else if (entityRow == null) {
            // old item exists but the new one is null (i.e. old is deleted)
            ArrayUtils.removeByIndex(previousIndex, this.items);
        } else {
            // oldRowValues and entityRow are not null
            ArrayUtils.removeByIndex(previousIndex, this.items);
            this._insertEntityRow(entityRow);
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
        const previousIndex = previousStatePart?.entity != null ? this.findIndexById(previousStatePart.entity.id) : undefined;
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
     * Inserting the entityRow at the position specified by entityRow. Updating the index to the index in
     * this.items; the updated index is used to determine whether a position change occurred while the
     * actual placement of the item will actually rely on the other positioning properties
     * (see rowIndexChanged in SimpleRowView.update).
     *
     * Priority when adding to items: beforeRowId, afterRowId, append (boolean but not null), index.
     *
     * @param {TItem} entityRow
     * @protected
     */
    _insertEntityRow(entityRow) {
        if (entityRow.beforeRowId != null) {
            const index = this.findIndexById(entityRow.beforeRowId);
            AssertionUtils.isTrue(entityRow.index == null || entityRow.index === index);
            ArrayUtils.insert(entityRow, index, this.items);
            entityRow.index = entityRow.index ?? index;
        } else if (entityRow.afterRowId != null) {
            const newIndex = this.findIndexById(entityRow.afterRowId) + 1;
            AssertionUtils.isTrue(entityRow.index == null || entityRow.index === newIndex);
            ArrayUtils.insert(entityRow, newIndex, this.items);
            entityRow.index = entityRow.index ?? newIndex;
        } else if (entityRow.append) {
            const newIndex = this.items.length;
            AssertionUtils.isTrue(entityRow.index == null || entityRow.index === newIndex
                || entityRow.index === PositionUtils.LAST_ELEMENT_INDEX);
            this.items.push(entityRow);
            entityRow.index = entityRow.index ?? newIndex;
        } else if (entityRow.append === false) {
            AssertionUtils.isTrue(entityRow.index == null || entityRow.index === 0);
            ArrayUtils.insert(entityRow, 0, this.items);
            entityRow.index = entityRow.index ?? 0;
        } else if (entityRow.index != null) {
            if (entityRow.index === PositionUtils.LAST_ELEMENT_INDEX) {
                this.items.push(entityRow);
                entityRow.index = this.items.length - 1;
            } else {
                ArrayUtils.insert(entityRow, entityRow.index, this.items);
            }
            this._updatePositioningProperties(entityRow);
        } else {
            AssertionUtils.isTrue(typeof entityRow.append === "boolean",
                `No positioning properties provided!\n${JSON.stringify(entityRow)}`)
        }
        AssertionUtils.isTrue(PositionUtils.areAllButIndexValid(entityRow),
            `Inconsistent positioning properties!\n${JSON.stringify(entityRow)}`);
    }

    /**
     * @param {TItem} entityRow
     * @protected
     */
    _updatePositioningProperties(entityRow) {
        const index = this.findIndexById(entityRow.entity.id);
        AssertionUtils.isTrue(entityRow.index === PositionUtils.LAST_ELEMENT_INDEX ||
            entityRow.index === index, `Bad positioning index!\n${JSON.stringify(entityRow)}`);
        if (index === 0) {
            entityRow.append = false;
        } else if (index === this.items.length - 1) {
            entityRow.append = true;
        } else {
            const theJustAfterItem = this.items[index + 1];
            entityRow.beforeRowId = theJustAfterItem.entity.id;
        }
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
     * Instantiate a new item initialized with "item" properties and insert
     * it into this.items or, if the item.id already exists, update the item.
     * If previousItemId is provided and differs than item.id than remove the previousItemId-item.
     *
     * Provide updateOptions only if wanting to change item's position.
     * Provide createOptions if wanting to change item's position or wanting to provide previousItemId.
     *
     * @param {IdentifiableEntity<E>} item
     * @param {number|string=} previousItemId
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}=} createOptions
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}=} updateOptions
     * @return {TaggedStateChange<TItem>}
     */
    createOrUpdate(item, previousItemId, createOptions, updateOptions) {
        if (previousItemId != null && !EntityUtils.idsAreEqual(item.id, previousItemId)) {
            // item acquired a new id, removing the previous version having options.previousItemId
            const stateChange = this.removeById(previousItemId);
            // by default keeping the previous index for the item that changed its id
            if (createOptions) {
                createOptions = createOptions ?? {};
                createOptions.index = createOptions.index ?? stateChange.partName;
            }
        }
        if (this.findById(item.id)) {
            AssertionUtils.isTrue(previousItemId == null,
                `Item changed its id but the new allocated id is already used!\n${JSON.stringify(item)}`);
            return this.updateItem(item, updateOptions);
        } else {
            return this.createNewItem(item, createOptions)
        }
    }

    /**
     * Insert the provided item (unique by id) into this.items.
     * Use this.append as the default positioning approach.
     *
     * @param {IdentifiableEntity<E>} identifiableEntity
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     * @return {TaggedStateChange<TItem>}
     */
    insertItem(identifiableEntity, options = {}) {
        AssertionUtils.isFalse(identifiableEntity.id != null && !!this.findById(identifiableEntity.id),
            `Can't insert duplicated item (id = ${identifiableEntity.id})!`);
        options.append = PositionUtils.areAllPositioningPropertiesEmpty() ? this.append : options.append;
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
            _.defaults(item, initialValue);
        }
        return this.insertItem(item, options);
    }

    /**
     * Update the item having item.id changing its position with options.
     * Use current item's index as the default positioning approach.
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
        options.index = PositionUtils.areAllPositioningPropertiesEmpty() ? currentIndex : options.index;
        return this.replacePart(new EntityRow(item, options), currentIndex);
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
        return this.items.findIndex((rowEntity) => EntityUtils.idsAreEqual(rowEntity.entity.id, id));
    }

    /**
     * @param {string|number} id
     * @return {TItem}
     */
    findById(id) {
        return this.items.find((rowEntity) => EntityUtils.idsAreEqual(rowEntity.entity.id, id));
    }
}