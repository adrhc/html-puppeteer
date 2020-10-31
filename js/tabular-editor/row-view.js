class RowView {
    constructor(tabularEditorState, table, rowTemplateId) {
        this.context = tabularEditorState;
        this.table = table;
        this.rowTemplateId = rowTemplateId;
    }

    hide() {
        this.table.deleteRow(this.context.selectedIndex);
    }

    show() {
        const row = this.table.createRow(this.context.selectedIndex, this.rowTemplateId);
        Array.from(row.cells).forEach(cell => this.putCellValue(cell));
    }

    /**
     * private
     */
    putCellValue(cell) {
        if (this.cellHasField(cell)) {
            this.putCellFieldValue(cell);
        } else {
            this.putCellTextValue(cell);
        }
    }

    /**
     * private
     */
    cellHasField(cell) {
        return !!cell.firstElementChild;
    }

    /**
     * private
     */
    putCellFieldValue(cell) {
        cell.firstElementChild.value = this.rowData[cell.firstElementChild.name];
    }

    /**
     * private
     */
    putCellTextValue(cell) {
        cell.textContent = this.rowData[cell.dataset['name']];
    }

    get rowData() {
        return this.context.items[this.context.selectedIndex];
    }
}