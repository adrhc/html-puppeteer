/**
 * Role: represent visually a row
 */
class RowView {
    constructor(tabularEditorState, table, rowTemplateId) {
        this.context = tabularEditorState;
        this.table = table;
        this.rowTemplateId = rowTemplateId;
    }

    switchTo(toRowView) {
        this.hide();
        toRowView.show();
    }

    hide() {
        this.table.deleteRow(this.context.selectedRow);
    }

    show() {
        const row = this.table.createRow(this.context.selectedRow, this.rowTemplateId);
        Array.from(row.cells).forEach(cell => this.putCellValue(cell));
    }

    /**
     * private
     */
    putCellValue(cell) {
        const cellAdapter = new HtmlCellAdapter(cell);
        const cellValue = this.state[cellAdapter.getName()];
        if (cellAdapter.hasChildField()) {
            if (cellAdapter.hasHiddenChildField()) {
                cellAdapter.prependTextNode(cellValue);
            }
            cellAdapter.putChildFieldValue(cellValue);
        } else {
            cellAdapter.putTextValue(cellValue);
        }
    }

    /**
     * private
     */
    get state() {
        return this.context.items[this.context.selectedRow];
    }
}