class TabularEditorState {
    items = undefined;
    selectedIndex = -1;

    constructor(items) {
        this.items = items;
    }

    selectionExists() {
        return this.selectedIndex >= 0;
    }
}