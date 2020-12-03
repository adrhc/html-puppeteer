class EditableTableState {
    _selectedId = undefined;
    _items = undefined;

    /**
     * @param selectedId
     * @returns {StateChanges}
     */
    switchSelectionTo(selectedId) {
        const stateChanges = this.cancelSelection();
        if (!stateChanges) {
            // no previous selection
            this._selectedId = selectedId;
            return new StateChanges(undefined, this.selectionState,
                undefined, this.transientSelectionExists());
        } else if (this.isIdSelected(selectedId)) {
            // current selection is not changed (is just again selected)
            return undefined;
        }
        this._selectedId = selectedId;
        stateChanges.newRowState = this.selectionState;
        // because a transient de-selection is advertised as a removal
        // than a transient selection is advertised as a creation
        stateChanges.newIsCreated = this.transientSelectionExists();
        return stateChanges;
    }

    /**
     * @returns {StateChanges|undefined}
     */
    cancelSelection() {
        if (!this.selectionExists()) {
            // no selection
            return undefined;
        }
        // selection exists
        const prevTabularItemState = this.selectionState;
        const transientSelectionExists = this.transientSelectionExists();
        if (transientSelectionExists) {
            this.removeSelectedItem();
        }
        this._selectedId = undefined;
        return new StateChanges(prevTabularItemState, undefined, transientSelectionExists);
    }

    /**
     * @param item
     * @returns {StateChanges}
     */
    cancelSelectionAndUpdateItem(item) {
        const stateChanges = this.cancelSelection();
        if (!stateChanges) {
            console.error("A row is updated without previously being selected!", item);
            return undefined;
        }
        this._replaceItem(item.id, item);
        stateChanges.newRowState = this.getStateOf(item.id);
        // when "previous" is a transient than the updated is in fact
        // a "new" item to be stored which appears as a creation
        stateChanges.newIsCreated = stateChanges.prevIsRemoved;
        return stateChanges;
    }

    /**
     * @returns {StateChanges}
     */
    createTransientSelection() {
        if (this.transientSelectionExists()) {
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

    transientSelectionExists() {
        return EntityUtils.prototype.isTransientId(this._selectedId);
    }

    /**
     * private method
     */
    get selectionState() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return new RowState(this._selectedId, this.selectedItem, true);
    }

    /**
     * private method
     */
    get selectedItem() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return this._items[this._selectedId];
    }

    /**
     * private method
     */
    getStateOf(id) {
        if (!this._items || !this._items[id]) {
            return undefined;
        }
        return new RowState(id, this._items[id], this.isIdSelected(id));
    }

    /**
     * private method
     */
    _replaceItem(id, item) {
        this._items[id] = item;
    }

    /**
     * private method
     */
    insertNewItem() {
        const NEW_ID = EntityUtils.prototype.NEW_ID;
        this._items[NEW_ID] = {id: NEW_ID};
        return this._items[NEW_ID];
    }

    /**
     * private method
     */
    removeSelectedItem() {
        delete this._items[this._selectedId];
    }

    /**
     * private method
     */
    set selectedId(selectedId) {
        throw `Unsupported operation! selectedId = ${selectedId}`;
    }

    /**
     * this plays also the role of an "initialization" method
     */
    set items(items) {
        this._items = {};
        this._selectedId = undefined;
        items.forEach(p => this._items[p.id] = p);
    }
}