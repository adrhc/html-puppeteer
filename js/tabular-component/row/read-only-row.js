/**
 * Represent the rendering capabilities of EditableTable at row level.
 */
class ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        this.htmlTableAdapter = htmlTableAdapter;
        this.rowTmpl = rowTmpl;
    }

    hide(rowState) {
        this.htmlTableAdapter.deleteRow(rowState.index);
    }

    show(rowState, asNew) {
        this.htmlTableAdapter.renderRow(rowState.index, rowState.cellValues, this.rowTmpl, !asNew);
    }
}