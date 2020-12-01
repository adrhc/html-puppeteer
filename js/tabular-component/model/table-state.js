class TableState {
    _selectedId = undefined;

    /**
     * @param selectedId
     * @returns {StateChanges}
     */
    switchSelectionTo(selectedId) {
        if (!this.selectionExists()) {
            // no previous selection
            this._selectedId = selectedId;
            return new StateChanges(undefined, this.selectionState);
        } else if (this.isIdSelected(selectedId)) {
            // current selection is not changed (is just again selected)
            return new StateChanges(this.selectionState, this.selectionState);
        }
        // previous selection exists, new item is selected
        const prevTabularItemState = this.selectionState;
        const transientSelectionExists = this.transientSelectionExists();
        if (transientSelectionExists) {
            this.removeSelectedItem();
        }
        this._selectedId = selectedId;
        return new StateChanges(prevTabularItemState, this.selectionState, transientSelectionExists);
    }

    /**
     * @param item
     * @param cancelSelection
     * @returns {StateChanges}
     */
    replaceItemForSelection(item, cancelSelection) {
        const prevTabularItemState = this.selectionState;
        const prevSelectedId = this._selectedId;
        this.replaceItem(prevSelectedId, item);
        if (cancelSelection) {
            this._selectedId = undefined;
        }
        return new StateChanges(prevTabularItemState, this.getStateAt(prevSelectedId));
    }

    /**
     * @returns {StateChanges}
     */
    createEmptySelection() {
        if (this.transientSelectionExists()) {
            // current (transient) selection is not changed
            return new StateChanges(this.selectionState, this.selectionState);
        }
        // no transient selection exists
        const prevTabularItemState = this.selectionState;
        this._selectedId = this.insertNewItem().id;
        return new StateChanges(prevTabularItemState, this.selectionState, false, true);
    }

    /**
     * @returns {StateChanges}
     */
    cancelSelection() {
        return this.switchSelectionTo();
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

    get selectedItem() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return this._items[this._selectedId];
    }

    get selectionState() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return new RowState(true, this._selectedId, this.selectedItem);
    }

    getStateAt(id) {
        if (!this._items || !this._items.length) {
            return undefined;
        }
        return new RowState(this.isIdSelected(id), id, this._items[id]);
    }

    /**
     * private method
     */
    replaceItem(id, item) {
        this._items[id] = item;
    }

    /**
     * private method
     */
    insertNewItem() {
        this._items["newItem"] = {id: "newItem"};
        return this._items["newItem"];
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

    set items(items) {
        this._items = {};
        items.forEach(p => this._items[p.id] = p);
    }
}