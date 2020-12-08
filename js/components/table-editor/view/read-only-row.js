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

    hide(item) {
        this.mustacheTableElemAdapter.deleteRowByDataId(item.id)
    }

    show(item) {
        const rowIndex = this.mustacheTableElemAdapter.getRowIndexByDataId(item.id);
        const createNew = rowIndex == null;
        this.renderRow(createNew ? 0 : rowIndex, this.itemViewOf(item), !createNew);
    }

    /**
     * @param rowIndex {number}
     * @param cellsView
     * @param replaceExisting {boolean}
     * @protected
     */
    renderRow(rowIndex, cellsView, replaceExisting) {
        this.mustacheTableElemAdapter.renderRow(rowIndex, cellsView, this.rowTmplHtml, replaceExisting);
    }

    /**
     * appends htmlId to cloned cellValues then return it
     * @param item {IdentifiableEntity}
     */
    itemViewOf(item) {
        const htmlId = EntityUtils.prototype.hasEmptyId(item) ? "" : item.id;
        return {htmlId: htmlId, item: item};
    }
}