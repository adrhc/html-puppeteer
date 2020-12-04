/**
 * Represent the rendering capabilities of TableEditorComponent at row level.
 */
class ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        this.htmlTableAdapter = htmlTableAdapter;
        this.rowTmpl = rowTmpl;
    }

    hide(_item) {
        this.htmlTableAdapter.deleteRowById(_item.id)
    }

    show(_item) {
        const rowIndex = this.htmlTableAdapter.getRowIndexById(_item.id);
        const createNew = rowIndex == null;
        this.renderRow(createNew ? 0 : rowIndex, this.cellsViewOf(_item), !createNew);
    }

    renderRow(rowIndex, cellsView, replaceExisting) {
        this.htmlTableAdapter.renderRow(rowIndex, cellsView, this.rowTmpl, replaceExisting);
    }

    /**
     * appends htmlId to cloned cellValues then return it
     * @param _item
     */
    cellsViewOf(_item) {
        const htmlId = EntityUtils.prototype.hasEmptyId(_item) ? "" : _item.id;
        return $.extend({htmlId: htmlId}, _item);
    }
}