class TableEditorState {
    _selectedId = undefined;
    _items = undefined;

    /**
     * @returns {StateChange|undefined} cancelled and no longer selected StateChange
     */
    cancelSelection() {
        if (!this.selectionExists()) {
            // no selection
            return undefined;
        }
        // selection exists
        const prevTabularItemState = this.selectedItem;
        const transientSelectionExists = this._transientSelectionExists;
        if (transientSelectionExists) {
            this.removeTransientItem();
        }
        this._selectedId = undefined;
        return new StateChange(prevTabularItemState, transientSelectionExists);
    }

    /**
     * @param selectedId
     * @returns {StateChange[]|undefined} cancelled StateChange (no longer selected) and the updated StateChange (selected)
     */
    switchSelectionTo(selectedId) {
        if (this.isIdSelected(selectedId)) {
            // current selection is not changed (is just again selected)
            return Promise.reject();
        }
        const stateChange = this.cancelSelection();
        if (!stateChange) {
            // no previous selection
            this._selectedId = selectedId;
            return Promise.resolve([new StateChange(this.selectedItem, this._transientSelectionExists, true)]);
        }
        this._selectedId = selectedId;
        // because a transient de-selection is advertised as a removal
        // than a transient selection is advertised as a creation
        return Promise.resolve([stateChange, new StateChange(this.selectedItem, this._transientSelectionExists, true)]);
    }

    /**
     * @param item
     * @returns {StateChange[]|undefined} cancelled StateChange and the updated StateChange (both no longer selected)
     */
    cancelSelectionAndUpdateItem(item) {
        if (this.isTransient(item.id)) {
            console.error("A row is updated but remains still transient!", item);
            return undefined;
        }
        const stateChange = this.cancelSelection();
        if (!stateChange) {
            console.error("A row is updated without previously being selected!", item);
            return undefined;
        }
        this.replaceItem(item);
        // when "previous" is a transient than the updated is in fact
        // a "new" item to be stored which appears as a creation
        return [stateChange, new StateChange(this._getItemById(item.id))];
    }

    /**
     * @param appendNewRows {boolean}
     * @returns {StateChange[]|undefined}
     */
    createTransientSelection(appendNewRows) {
        if (this._transientSelectionExists) {
            // current (transient) selection is not changed
            return undefined;
        }
        // no transient selection exists
        const newItemId = this.insertNewItem().id;
        return this.switchSelectionTo(newItemId);
    }

    /**
     * "named processing" method type
     *
     * @param id
     * @returns {boolean}
     */
    isIdSelected(id) {
        return this._selectedId === id;
    }

    /**
     * @returns {boolean}
     */
    selectionExists() {
        return this._selectedId != null;
    }

    get _transientSelectionExists() {
        return EntityUtils.prototype.isTransientId(this._selectedId);
    }

    isTransient(id) {
        return EntityUtils.prototype.isTransientId(id);
    }

    /**
     * @returns {undefined|*}
     */
    get selectedItem() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return this.findById(this._selectedId)
    }

    /**
     * @param id {number}
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.prototype.findById(id, this._items)
    }

    /**
     * private method
     */
    _getItemById(id) {
        const item = this.findById(id);
        if (!this._items) {
            return undefined;
        }
        return item;
    }

    /**
     * @param item {IdentifiableEntity}
     */
    replaceItem(item) {
        EntityUtils.prototype.findAndReplaceById(item, this._items);
    }

    insertNewItem(appendNewRows) {
        const item = EntityUtils.prototype.newIdentifiableEntity();
        if (appendNewRows) {
            this._items.push(item);
        } else {
            this._items.unshift(item);
        }
        return item;
    }

    removeSelectedItem() {
        return EntityUtils.prototype.removeById(this._selectedId, this.items);
    }

    removeTransientItem() {
        return EntityUtils.prototype.removeTransient(this.items);
    }

    /**
     * @private
     */
    set selectedId(selectedId) {
        throw `Unsupported operation! selectedId = ${selectedId}`;
    }

    get selectedId() {
        return this._selectedId;
    }

    /**
     * this plays also the role of an "initialization" method
     */
    set items(items) {
        this._items = items;
        this._selectedId = undefined;
    }

    get items() {
        return this._items;
    }
}