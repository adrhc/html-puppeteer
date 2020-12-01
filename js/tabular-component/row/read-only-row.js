/**
 * Represent the rendering capabilities of EditableTable at row level.
 */
class ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        this.htmlTableAdapter = htmlTableAdapter;
        this.rowTmpl = rowTmpl;
    }

    hide(rowState) {
        this.htmlTableAdapter.deleteRowById(rowState.id)
    }

    show(rowState, asNew) {
        const rowIndex = asNew ? 0 : this.htmlTableAdapter.getRowIndexById(rowState.id);
        this.htmlTableAdapter.renderRow(rowIndex, this.cellsViewOf(rowState), this.rowTmpl, !asNew);
    }

    /**
     * appends htmlId to cloned cellValues then return it
     * @param rowState
     */
    cellsViewOf(rowState) {
        const htmlId = EntityUtils.prototype.hasEmptyId(rowState) ? "" : rowState.id;
        return $.extend({htmlId: htmlId}, rowState.cellValues);
    }
}