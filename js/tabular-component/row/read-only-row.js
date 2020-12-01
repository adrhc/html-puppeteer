/**
 * Represent the rendering capabilities of EditableTable at row level.
 */
class ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        this.htmlTableAdapter = htmlTableAdapter;
        this.rowTmpl = rowTmpl;
    }

    hide(rowState) {
        $(`#${rowState.id}`).remove()
    }

    show(rowState, asNew) {
        const rowElem = $(`#${rowState.id}`)[0];
        const rowIndex = asNew ? 0 : (rowElem.sectionRowIndex == null ? rowElem.rowIndex : rowElem.sectionRowIndex);
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