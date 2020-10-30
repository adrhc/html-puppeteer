class TabularEditorState {
    items = undefined;
    selectedRow = undefined;

    constructor(items) {
        this.items = items;
    }

    selectionExists() {
        return !!this.selectedRow;
    }

    get selectedIndex() {
        return this.selectedRow.index;
    }
}