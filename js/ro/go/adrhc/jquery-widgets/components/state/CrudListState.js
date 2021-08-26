/**
 * @typedef {IdentifiableEntity} TItem
 * @typedef {IdentifiableEntity} P
 * @extends {SimpleListState<IdentifiableEntity[], EntityRow<IdentifiableEntity>>}
 */
class CrudListState extends SimpleListState {
    /**
     * @type {function(): IdentifiableEntity}
     */
    newEntityFactoryFn;
    /**
     * whether to append or prepend new items
     *
     * @type {boolean|undefined}
     */
    append;

    /**
     * @param {IdentifiableEntity[]=} initialState
     * @param {function(): IdentifiableEntity=} newEntityFactoryFn
     * @param {boolean=} newItemsGoLast
     * @param {TaggingStateChangeMapper<IdentifiableEntity[]>=} stateChangeMapper
     * @param {StateChangesCollector<IdentifiableEntity[]>=} changeManager
     */
    constructor({
                    initialState,
                    newEntityFactoryFn = () => new IdentifiableEntity(IdentifiableEntity.TRANSIENT_ID),
                    newItemsGoLast,
                    stateChangeMapper,
                    changeManager
                }) {
        super({initialState, stateChangeMapper, changeManager});
        this.newEntityFactoryFn = newEntityFactoryFn;
        this.append = newItemsGoLast;
    }

    /**
     * @param {EntityRow<IdentifiableEntity>} newRowValues
     * @param {number} oldIndex
     * @return {boolean}
     * @protected
     */
    _currentStatePartEquals(newRowValues, oldIndex) {
        const isPrevNullOrMissing = oldIndex >= this.items.length ||
            oldIndex < this.items.length && this.items[oldIndex] == null;
        const bothNewAndPrevAreNull = newRowValues == null && isPrevNullOrMissing;
        return bothNewAndPrevAreNull ||
            !isPrevNullOrMissing && newRowValues != null &&
            newRowValues.index === oldIndex &&
            this.items[oldIndex] === newRowValues.entity;
    }

    /**
     * @param {EntityRow<IdentifiableEntity>} newRowValues
     * @param {number} previousIndex
     * @return {EntityRow<IdentifiableEntity>} previous state part
     * @protected
     */
    _replacePartImpl(newRowValues, previousIndex) {
        AssertionUtils.isTrue(newRowValues?.index == null
            || EntityRow.areAllButIndexPositioningPropertiesEmpty(newRowValues),
            `Not allowed to have both index and positioning properties set! ${JSON.stringify(newRowValues)}`);
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
     * @param {EntityRow<IdentifiableEntity>=} previousStatePart
     * @param {EntityRow<IdentifiableEntity>=} partialState
     * @param {string|number=} dueToChangePartName
     * @return {StateChange<EntityRow<IdentifiableEntity>>|undefined}
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
     * @return {EntityRow<IdentifiableEntity>|undefined}
     */
    getStatePart(index) {
        if (this.items == null || index < 0 || index >= this.items.length) {
            return undefined;
        }
        const item = this.items[index];
        return item == null ? undefined : new EntityRow(item, {index});
    }

    /**
     * The purpose of this method is to provide type checking and a default for oldIndex parameter.
     *
     * @param {EntityRow<IdentifiableEntity>} rowValues
     * @param {number=} previousIndex
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>> | boolean}
     * @protected
     */
    replacePart(rowValues, previousIndex = rowValues.index) {
        return super.replacePart(rowValues, previousIndex);
    }

    /**
     * @param {EntityRow<IdentifiableEntity>} entityRow
     * @protected
     */
    _insertEntityRow(entityRow) {
        if (entityRow.index != null) {
            if (entityRow.index === TableElementAdapter.LAST_ROW_INDEX) {
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
        this._updateRelativePosition(entityRow);
    }

    /**
     * @param {EntityRow<IdentifiableEntity>} entityRow
     * @protected
     */
    _updateRelativePosition(entityRow) {
        if (entityRow.index === 0 || entityRow.index === TableElementAdapter.LAST_ROW_INDEX
            || entityRow.append != null || entityRow.beforeRowId != null || entityRow.afterRowId != null) {
            return;
        }
        const index = this.indexOf(entityRow.entity);
        if (index === 0) {
            entityRow.append = false;
        } else if (entityRow.index === this.items.length - 1) {
            entityRow.append = true;
        } else {
            /**
             * @type {IdentifiableEntity}
             */
            const itemFollowingEntityRow = this.items[index + 1];
            entityRow.beforeRowId = itemFollowingEntityRow.id;
        }
    }

    /**
     * Instantiate a new item initialized with "item" properties and insert
     * it into this.items or, if the item.id already exists, update the item.
     * If previousItemId is provided and differs than item.id than remove the previousItemId-item.
     *
     * Provide updateOptions only if wanting to change item's position.
     * Provide createOptions if wanting to change item's position or wanting to provide previousItemId.
     *
     * @param {IdentifiableEntity} item
     * @param {{previousItemId?: number|string, index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}=} createOptions
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}=} updateOptions
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
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
     * @param {IdentifiableEntity} item
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
     */
    insertItem(item, options = {}) {
        AssertionUtils.isFalse(item.id != null && !!this.findById(item.id), `Can't insert duplicated item (id = ${item.id})!`);
        options.append = options.append ?? this.append;
        return this.replacePart(new EntityRow(item, options));
    }

    /**
     * Instantiate a new item and insert it into this.items (by calling insertItem).
     *
     * @param {IdentifiableEntity|{}} [initialValue]
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
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
     * @param {IdentifiableEntity} item
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
     */
    updateItem(item, options = {}) {
        const currentIndex = this.findIndexById(item.id);
        AssertionUtils.isTrue(currentIndex !== -1, `Can't update missing item (id = ${item.id})!`);
        options.index = EntityRow.areAllPositioningPropertiesEmpty(options) ? currentIndex : options.index;
        return this.replacePart(new EntityRow(item, options), currentIndex);
    }

    indexOf(item) {
        return this.items.indexOf(item);
    }

    /**
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
     */
    removeTransient() {
        return this.removeById(IdentifiableEntity.TRANSIENT_ID);
    }

    /**
     * @param {number|string} id
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>> | boolean}
     */
    removeById(id) {
        const indexToRemove = this.findIndexById(id);
        return this._removeItem(indexToRemove);
    }

    /**
     * @param {number} index
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>> | boolean}
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
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.findById(id, this.items);
    }
}