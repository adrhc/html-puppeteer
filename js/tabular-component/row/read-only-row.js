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
        const cellValues = $.extend({htmlId: rowState.cellValues.id}, rowState.cellValues);
        if (EntityUtils.prototype.hasEmptyId(rowState)) {
            delete cellValues.id;
        }
        this.htmlTableAdapter.renderRow(rowIndex, cellValues, this.rowTmpl, !asNew);
    }
}