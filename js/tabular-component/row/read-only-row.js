/**
 * Represent the rendering capabilities of EditableTable at row level.
 */
class ReadOnlyRow {
    constructor(table, rowTmpl) {
        this.table = table;
        this.rowTmpl = rowTmpl;
    }

    hide(tabularRowState) {
        this.table.deleteRow(tabularRowState.index);
    }

    show(tabularRowState, asNew) {
        this.table.renderRow(tabularRowState.index, tabularRowState.cellValues, this.rowTmpl, !asNew);
    }
}