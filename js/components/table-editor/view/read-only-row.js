/**
 * Represent the rendering capabilities of TableEditorComponent at row level.
 */
class ReadOnlyRow {
    /**
     * @param htmlTableAdapter {HtmlTableAdapter}
     * @param rowTmplId {string}
     * @param rowTmplHtml {string}
     */
    constructor(htmlTableAdapter, {rowTmplId, rowTmplHtml}) {
        this.htmlTableAdapter = htmlTableAdapter;
        if (rowTmplId) {
            this.rowTmplHtml = $(`#${rowTmplId}`).html();
        } else if (rowTmplHtml) {
            this.rowTmplHtml = rowTmplHtml;
        }
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
        const rowHtml = cellsView ? Mustache.render(this.rowTmplHtml, cellsView) : this.rowTmplHtml;
        this.htmlTableAdapter.renderRow(rowIndex, rowHtml, replaceExisting);
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