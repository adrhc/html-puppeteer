class EditableTableState {
    _selectedId = undefined;
    _items = undefined;

    /**
     * @returns {StateChange|undefined}
     */
    cancelSelection() {
        if (!this.selectionExists()) {
            // no selection
            return undefined;
        }
        // selection exists
        const prevTabularItemState = this._selectedItem;
        const transientSelectionExists = this._transientSelectionExists;
        if (transientSelectionExists) {
            this.removeSelectedItem();
        }
        this._selectedId = undefined;
        return new StateChange(prevTabularItemState, transientSelectionExists);
    }

    /**
     * @param selectedId
     * @returns {StateChange[]|undefined}
     */
    switchSelectionTo(selectedId) {
        const stateChange = this.cancelSelection();
        if (!stateChange) {
            // no previous selection
            this._selectedId = selectedId;
            return [new StateChange(this._selectedItem, this._transientSelectionExists, true)];
        } else if (this.isIdSelected(selectedId)) {
            // current selection is not changed (is just again selected)
            return undefined;
        }
        this._selectedId = selectedId;
        // because a transient de-selection is advertised as a removal
        // than a transient selection is advertised as a creation
        return [stateChange, new StateChange(this._selectedItem, this._transientSelectionExists, true)];
    }

    /**
     * @param item
     * @returns {StateChange[]|undefined}
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
        this._replaceItem(item.id, item);
        // when "previous" is a transient than the updated is in fact
        // a "new" item to be stored which appears as a creation
        return [stateChange, new StateChange(this._getItemById(item.id))];
    }

    /**
     * @returns {StateChange[]|undefined}
     */
    createTransientSelection() {
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
    get _selectedItem() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return this._items[this._selectedId];
    }

    /**
     * private method
     */
    _getItemById(id) {
        if (!this._items || !this._items[id]) {
            return undefined;
        }
        return this._items[id];
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