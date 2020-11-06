class TabularEditorState {
    selectedIndex = undefined;

    constructor(items) {
        this.items = items;
    }

    selectionExists() {
        return this.selectedIndex >= 0;
    }

    selectedIsPersistent() {
        return this.items && this.items.length > this.selectedIndex &&
            $.isNumeric(this.items[this.selectedIndex].id);
    }

    removeSelected() {
        this.items.splice(this.selectedIndex, 1);
        this.selectedIndex = undefined;
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items == null ? [] : items;
    }
}