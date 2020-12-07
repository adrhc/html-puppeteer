/**
 * Represent the rendering capabilities of TableEditorComponent at row level.
 */
class ReadOnlyRow {
    /**
     * @param tableElementAdapter {TableElementAdapter}
     * @param rowTmplId {string}
     * @param rowTmplHtml {string}
     */
    constructor(tableElementAdapter, {rowTmplId, rowTmplHtml}) {
        this.tableElementAdapter = tableElementAdapter;
        if (rowTmplId) {
            this.rowTmplHtml = $(`#${rowTmplId}`).html();
        } else if (rowTmplHtml) {
            this.rowTmplHtml = rowTmplHtml;
        }
    }

    hide(_item) {
        this.tableElementAdapter.deleteRowById(_item.id)
    }

    show(_item) {
        const rowIndex = this.tableElementAdapter.getRowIndexById(_item.id);
        const createNew = rowIndex == null;
        this.renderRow(createNew ? 0 : rowIndex, this.cellsViewOf(_item), !createNew);
    }

    renderRow(rowIndex, cellsView, replaceExisting) {
        const rowHtml = cellsView ? Mustache.render(this.rowTmplHtml, cellsView) : this.rowTmplHtml;
        this.tableElementAdapter.renderRow(rowIndex, rowHtml, replaceExisting);
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