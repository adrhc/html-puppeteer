class TabularEditorState {
    selectedRow = undefined;

    constructor(items) {
        this.items = items;
    }

    selectionExists() {
        return this.selectedRow >= 0;
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items == null ? [] : items;
    }
}