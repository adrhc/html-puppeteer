class TabularEditorState {
    items = undefined;
    selectedRow = -1;

    constructor(items) {
        this.items = items;
    }

    selectionExists() {
        return this.selectedRow >= 0;
    }
}