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
        return this.getCellField(cell).length > 0;
    }

    /**
     * private
     */
    putCellFieldValue(cell) {
        this.getCellField(cell).val(this.getDataFor(cell));
    }

    /**
     * private
     */
    getCellField(cell) {
        const name = this.getCellName(cell);
        return $(cell).find(`input[name='${name}']`)
    }

    /**
     * private
     */
    putCellTextValue(cell) {
        cell.textContent = this.getDataFor(cell);
    }

    /**
     * private
     */
    getDataFor(cell) {
        return this.rowData[this.getCellName(cell)];
    }

    /**
     * private
     */
    getCellName(cell) {
        return cell.dataset['name'];
    }

    /**
     * private
     */
    get rowData() {
        return this.context.items[this.context.selectedRow];
    }
}