class SelectableRow {
    constructor(tabularEditorState, table, templateId) {
        this.context = tabularEditorState;
        this.table = table;
        this.templateId = templateId;
    }

    hide() {
        this.table.deleteRow(this.context.selectedIndex);
    }

    get rowData() {
        return this.context.items[this.context.selectedIndex];
    }

    get tmplContent() {
        return document.getElementById(this.templateId).content;
    }
}