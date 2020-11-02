class TabularEditorState {
    selectedRow = undefined;

    constructor(items) {
        this.items = items;
    }

    selectionExists() {
        return this.selectedRow >= 0;
    }
}