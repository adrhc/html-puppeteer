class EditableRow extends ReadOnlyRow {
    constructor(tabularEditorState, table, editorTemplate) {
        super(tabularEditorState, table, editorTemplate);
    }

    render() {
        this.table.insertRow(this.context.selectedIndex, this.tmplContent, this.renderCell.bind(this));
    }

    renderCell(cell) {
        if (this.isEditableCell(cell)) {
            this.renderEditableCell(cell);
        } else {
            super.renderCell(cell);
        }
    }

    /**
     * private
     */
    renderEditableCell(cell) {
        cell.firstElementChild.value = this.rowData[cell.firstElementChild.name];
    }

    /**
     * private
     */
    isEditableCell(cell) {
        return !!cell.firstElementChild;
    }
}