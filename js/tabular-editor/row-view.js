/**
 * Role: represent visually a row
 */
class RowView {
    constructor(tabularEditorState, table, rowTemplateId, rowEventHandlersConfigFn) {
        this.context = tabularEditorState;
        this.table = table;
        this.rowTemplateId = rowTemplateId;
        this.rowEventHandlersConfigFn = rowEventHandlersConfigFn;
    }

    hide() {
        this.table.deleteRow(this.context.selectedRow);
    }

    show() {
        const row = this.table.createRow(this.context.selectedRow, this.rowTemplateId);
        Array.from(row.cells).forEach(cell => this.putCellValue(cell));
        if (this.rowEventHandlersConfigFn) {
            this.rowEventHandlersConfigFn(row);
        }
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

    getDataFor(cell) {
        return this.rowData[this.getCellName(cell)];
    }

    getCellName(cell) {
        return cell.dataset['name'];
    }

    get rowData() {
        return this.context.items[this.context.selectedRow];
    }
}