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
        const position = this.selectedItemPosition;
        const transientSelectionExists = this._transientSelectionExists;
        if (transientSelectionExists) {
            this.removeTransientItem();
        }
        this._selectedId = undefined;
        return new StateChange(prevTabularItemState, position, {
            crudOperation: transientSelectionExists ? "DELETE" : undefined
        });
    }

    /**
     * @param selectedId {number}
     * @param crudOperation {"CREATE"|"UPDATE"|"DELETE"|undefined}
     * @returns {Promise<StateChange[]>} cancelled StateChange (no longer selected) and the updated StateChange (selected)
     */
    switchSelectionTo(selectedId, crudOperation) {
        if (this.isIdSelected(selectedId)) {
            // current selection is not changed (is just again selected)
            return Promise.reject();
        }
        const cancelStateChange = this.cancelSelection();
        if (!cancelStateChange) {
            // no previous selection
            this._selectedId = selectedId;
            // because a transient de-selection is advertised as a removal
            // than a transient selection is advertised as a creation
            return Promise.resolve([new StateChange(this.selectedItem, this.selectedItemPosition,
                {crudOperation, isSelected: true})]);
        }
        this._selectedId = selectedId;
        // because a transient de-selection is advertised as a removal
        // than a transient selection is advertised as a creation
        const selectedStateChange = new StateChange(this.selectedItem, this.selectedItemPosition,
            {crudOperation, isSelected: true});
        return Promise.resolve([cancelStateChange, selectedStateChange]);
    }

    /**
     * @param item
     * @returns {StateChange[]|undefined} cancelled StateChange and the updated StateChange (both no longer selected)
     */
    cancelSelectionAndUpdateItem(item) {
        if (this._isTransientId(item.id)) {
            console.error("A row is updated but remains still transient!", item);
            return undefined;
        }
        const stateChange = this.cancelSelection();
        if (!stateChange) {
            console.error("A row is updated without previously being selected!", item);
            return undefined;
        }
        let crudOperation;
        let position = stateChange.position;
        if (stateChange.crudOperation === "DELETE") {
            // selected item was transient (and removed by cancelSelection)
            this.insertItem(item, stateChange.position);
            crudOperation = "CREATE";
        } else {
            // selected item was a persistent one
            position = this.replaceItem(item);
            crudOperation = "UPDATE";
        }
        // when "previous" is a transient than the updated is in fact
        // a "new" item to be stored which appears as a creation
        return [stateChange, new StateChange(this._getItemById(item.id), position, {crudOperation})];
    }

    /**
     * @param append {boolean}
     * @returns {Promise<StateChange[]>}
     */
    createTransientSelection(append) {
        if (this._transientSelectionExists) {
            // current (transient) selection is not changed
            return Promise.reject();
        }
        // no transient selection exists
        const newItemId = this.createNewItem(append).id;
        return this.switchSelectionTo(newItemId, "CREATE");
    }

    /**
     * @return {number}
     */
    get selectedItemPosition() {
        return EntityUtils.prototype.findIndexById(this._selectedId, this._items);
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

    /**
     * @return {boolean}
     * @private
     */
    get _transientSelectionExists() {
        return this._isTransientId(this._selectedId);
    }

    _isTransientId(id) {
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
     * @private
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
     * @return item index
     */
    replaceItem(item) {
        return EntityUtils.prototype.findAndReplaceById(item, this._items);
    }

    /**
     * @param append {boolean}
     * @return {IdentifiableEntity}
     */
    createNewItem(append) {
        const item = EntityUtils.prototype.newIdentifiableEntity();
        if (append) {
            this._items.push(item);
        } else {
            this._items.unshift(item);
        }
        return item;
    }

    insertItem(item, position) {
        ArrayUtils.prototype.insert(item, position, this._items)
    }

    /**
     * @return {number|number[]} removed positions (aka indexes)
     */
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