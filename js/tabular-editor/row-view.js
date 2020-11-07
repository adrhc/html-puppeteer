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
        this.table.deleteRow(this.context.selectedIndex);
    }

    show() {
        const row = this.table.createRow(this.context.selectedIndex, this.rowTemplateId);
        Array.from(row.cells).map(cell => new HtmlCellAdapter(cell))
            .forEach(cellAdapter => this.setCellValue(cellAdapter));
    }

    /**
     * private
     */
    setCellValue(cellAdapter) {
        const cellValue = this.state[cellAdapter.name];
        if (cellAdapter.hasChildField()) {
            if (cellAdapter.hasHiddenChildField()) {
                cellAdapter.prependTextNode(cellValue);
            }
            cellAdapter.setChildFieldValue(cellValue);
        } else {
            cellAdapter.prependTextNode(cellValue);
        }
    }

    /**
     * private
     */
    get state() {
        return this.context.items[this.context.selectedIndex];
    }
}