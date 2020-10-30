class ReadOnlyRow extends SelectableRow {
    constructor(tabularEditorState, table, readOnlyRowTemplate) {
        super(tabularEditorState, table, readOnlyRowTemplate);
    }

    render() {
        this.table.insertRow(this.context.selectedIndex,
            this.tmplContent.firstElementChild, this.renderCell.bind(this));
    }

    renderCell(cell) {
        cell.textContent = this.rowData[cell.dataset['name']];
    }
}