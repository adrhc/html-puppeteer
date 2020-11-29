class TabularState {
    selectedIndex = undefined;

    constructor(items) {
        this.items = items;
    }

    createAndSelectEmptyItem(index) {
        this.items.splice(index, 0, {});
        this.selectedIndex = index;
    }

    replaceItem(item) {
        this.items.splice(this.selectedIndex, 1, item);
    }

    removeSelectedItem() {
        this.items.splice(this.selectedIndex, 1);
        return this.cancelSelection();
    }

    /**
     * "named processing" method type
     *
     * @returns {*} previous selection
     */
    cancelSelection() {
        const previousSelection = this.selectedIndex;
        this.selectedIndex = undefined;
        return previousSelection;
    }

    /**
     * "named processing" method type
     *
     * @param index
     * @returns {boolean}
     */
    isIndexSelected(index) {
        return this.selectedIndex === index;
    }

    /**
     * "named processing" method type
     *
     * @returns {boolean}
     */
    notSavedItemExists() {
        return this.selectionExists() && !this.selectionIsPersistent();
    }

    /**
     * @returns {boolean}
     */
    selectionExists() {
        return this.selectedIndex >= 0;
    }

    /**
     * @returns {boolean|*}
     */
    selectionIsPersistent() {
        return this.items.length > this.selectedIndex &&
            $.isNumeric(this.items[this.selectedIndex].id);
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items == null ? [] : items;
    }
}