/**
 * Represent the rendering capabilities of TabularComponent at row level.
 * Reacts to "row"-level state changes.
 */
class TabularRow {
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