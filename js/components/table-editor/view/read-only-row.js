/**
 * Represent the rendering capabilities of TableEditorComponent at row level.
 */
class ReadOnlyRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param rowTmplId {string}
     * @param rowTmplHtml {string}
     */
    constructor(mustacheTableElemAdapter, {rowTmplId, rowTmplHtml}) {
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
        if (rowTmplId) {
            this.rowTmplHtml = HtmlUtils.prototype.templateTextOf(rowTmplId);
        } else if (rowTmplHtml) {
            this.rowTmplHtml = rowTmplHtml;
        }
    }

    hide(_item) {
        this.mustacheTableElemAdapter.deleteRowByDataId(_item.id)
    }

    show(_item) {
        const rowIndex = this.mustacheTableElemAdapter.getRowIndexByDataId(_item.id);
        const createNew = rowIndex == null;
        this.renderRow(createNew ? 0 : rowIndex, this.itemViewOf(_item), !createNew);
    }

    renderRow(rowIndex, cellsView, replaceExisting) {
        this.mustacheTableElemAdapter.renderRow(rowIndex, cellsView, this.rowTmplHtml, replaceExisting);
    }

    /**
     * appends htmlId to cloned cellValues then return it
     * @param item {TableEditorItem}
     */
    itemViewOf(item) {
        const htmlId = EntityUtils.prototype.hasEmptyId(item) ? "" : item.id;
        return {htmlId: htmlId, item: item};
    }
}