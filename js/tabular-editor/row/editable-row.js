class EditableRow extends ReadOnlyRow {
    constructor(tabularEditorState, table, editorTemplate) {
        super(tabularEditorState, table, editorTemplate);
    }

    render() {
        this.table.insertRow(this.context.selectedIndex, this.tmplContent, this.renderCell.bind(this));
    }

    renderEditableCell(cell) {
        cell.firstElementChild.value = this.rowData[cell.firstElementChild.name];
    }

    renderCell(cell) {
        if (cell.firstElementChild) {
            this.renderEditableCell(cell);
        } else {
            super.renderCell(cell);
        }
    }
}