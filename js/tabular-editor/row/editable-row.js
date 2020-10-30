class EditableRow extends ReadOnlyRow {
    constructor(index, values, table, editorTemplate) {
        super(index, values, table, editorTemplate);
    }

    render() {
        this.table.insertRow(this.index, this.tmplContent, this.renderCell.bind(this));
    }

    renderCell(cell) {
        if (cell.firstElementChild) {
            this.renderEditableCell(cell);
        } else {
            super.renderCell(cell);
        }
    }

    renderEditableCell(cell) {
        cell.firstElementChild.value = this.values[cell.firstElementChild.name];
    }
}