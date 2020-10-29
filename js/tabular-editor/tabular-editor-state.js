class TabularEditorState {
    items = undefined;
    selectedIndex = -1;

    constructor(items) {
        this.items = items;
    }

    selectItem(index) {
        this.selectedIndex = index;
    }
}