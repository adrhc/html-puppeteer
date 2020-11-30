class TabularState {
    _selectedIndex = undefined;

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
        return new TabularItemState(this.isIndexSelected(index), index, this._items[index]);
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedIndex(selectedIndex) {
        throw `Unsupported operation! selectedIndex = ${selectedIndex}`;
    }

    /**
     * @param selectedIndex
     * @returns {StateChangeResult}
     */
    switchSelectionTo(selectedIndex) {
        if (!this.selectionExists()) {
            // no previous selection
            this._selectedIndex = selectedIndex;
            return new StateChangeResult(undefined, this.selectionState);
        } else if (this.isIndexSelected(selectedIndex)) {
            // current selection is not changed (is just again selected)
            return new StateChangeResult(this.selectionState, this.selectionState);
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
        return new StateChangeResult(prevTabularItemState, this.selectionState, transientSelectionExists);
    }

    /**
     * @returns {StateChangeResult}
     */
    cancelSelection() {
        return this.switchSelectionTo();
    }

    /**
     * @param item
     * @param cancelSelection
     * @returns {StateChangeResult}
     */
    replaceItemForSelection(item, cancelSelection) {
        const prevTabularItemState = this.selectionState;
        const prevSelectedIndex = this._selectedIndex;
        this.items.splice(prevSelectedIndex, 1, item);
        if (cancelSelection) {
            this._selectedIndex = undefined;
        }
        return new StateChangeResult(prevTabularItemState, this.getStateAt(prevSelectedIndex));
    }

    /**
     * @param index
     * @returns {StateChangeResult}
     */
    createEmptySelection(index) {
        if (this.transientSelectionExists()) {
            // current (transient) selection is not changed
            return new StateChangeResult(this.selectionState, this.selectionState);
        }
        // no transient selection exists
        const prevTabularItemState = this.selectionState;
        this.insertNewItem(index);
        this._selectedIndex = index;
        return new StateChangeResult(prevTabularItemState, this.selectionState, false, true);
    }

    constructor(items) {
        this.items = items;
    }

    insertNewItem(index) {
        this.items.splice(index, 0, {});
    }

    /**
     * remove the item state and reset the selected index
     */
    removeItem() {
        this.items.splice(this._selectedIndex, 1);
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

    /**
     * @returns {boolean|*}
     */
    selectionIsPersisted() {
        return this.selectionExists() &&
            $.isNumeric(this.items[this._selectedIndex].id);
    }

    transientSelectionExists() {
        return this.selectionExists() && !$.isNumeric(this.items[this._selectedIndex].id);
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items == null ? [] : items;
    }
}