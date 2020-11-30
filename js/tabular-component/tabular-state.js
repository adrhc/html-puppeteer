class TabularState {
    _selectedIndex = undefined;

    constructor(items, selectedIndex) {
        this.items = items;
        this._selectedIndex = selectedIndex;
    }

    /**
     * @param selectedIndex
     * @returns {StateChanges}
     */
    switchSelectionTo(selectedIndex) {
        if (!this.selectionExists()) {
            // no previous selection
            this._selectedIndex = selectedIndex;
            return new StateChanges(undefined, this.selectionState);
        } else if (this.isIndexSelected(selectedIndex)) {
            // current selection is not changed (is just again selected)
            return new StateChanges(this.selectionState, this.selectionState);
        }
        // previous selection exists, new item is selected
        const prevTabularItemState = this.selectionState;
        const prevSelItemPositionIsBeforeNewSelection = this._selectedIndex < selectedIndex;
        const transientSelectionExists = this.transientSelectionExists();
        if (transientSelectionExists) {
            this.removeItem();
        }
        const removedRowPositionedBeforeNewSelectionExists =
            transientSelectionExists && prevSelItemPositionIsBeforeNewSelection ? 1 : 0;
        this._selectedIndex = selectedIndex - removedRowPositionedBeforeNewSelectionExists;
        return new StateChanges(prevTabularItemState, this.selectionState, transientSelectionExists);
    }

    /**
     * @param item
     * @param cancelSelection
     * @returns {StateChanges}
     */
    replaceItemForSelection(item, cancelSelection) {
        const prevTabularItemState = this.selectionState;
        const prevSelectedIndex = this._selectedIndex;
        this.replaceItem(prevSelectedIndex, item);
        if (cancelSelection) {
            this._selectedIndex = undefined;
        }
        return new StateChanges(prevTabularItemState, this.getStateAt(prevSelectedIndex));
    }

    /**
     * @param index
     * @returns {StateChanges}
     */
    createEmptySelection(index) {
        if (this.transientSelectionExists()) {
            // current (transient) selection is not changed
            return new StateChanges(this.selectionState, this.selectionState);
        }
        // no transient selection exists
        const prevTabularItemState = this.selectionState;
        this.insertNewItem(index);
        this._selectedIndex = index;
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
     * @param index
     * @returns {boolean}
     */
    isIndexSelected(index) {
        return this._selectedIndex === index;
    }

    /**
     * @returns {boolean}
     */
    selectionExists() {
        return this._selectedIndex >= 0;
    }

    transientSelectionExists() {
        return this.selectionExists() && !$.isNumeric(this.selectedItem.id);
    }

    get selectedItem() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return this._items[this._selectedIndex];
    }

    get selectionState() {
        if (!this.selectionExists()) {
            return undefined;
        }
        return new TabularItemState(true, this._selectedIndex, this.selectedItem);
    }

    getStateAt(index) {
        if (!this._items || !this._items.length) {
            return undefined;
        }
        return new TabularItemState(this.isIndexSelected(index), index, this._items[index]);
    }

    /**
     * private method
     */
    replaceItem(index, item) {
        this._items.splice(index, 1, item);
    }

    /**
     * private method
     */
    insertNewItem(index) {
        this._items.splice(index, 0, {});
    }

    /**
     * private method
     */
    removeItem() {
        this._items.splice(this._selectedIndex, 1);
    }

    /**
     * private method
     */
    set selectedIndex(selectedIndex) {
        throw `Unsupported operation! selectedIndex = ${selectedIndex}`;
    }

    set items(items) {
        this._items = items == null ? [] : items;
    }
}