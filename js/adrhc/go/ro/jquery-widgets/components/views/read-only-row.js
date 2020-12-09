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
        this.mustacheTableElemAdapter.renderRowBeforeDataId(item.id, this.rowTmplHtml, this.itemViewOf(item), true);
    }

    /**
     * appends htmlId to cloned cellValues then return it
     * @param item {IdentifiableEntity}
     */
    itemViewOf(item) {
        if (!item) {
            return undefined;
        }
        const htmlId = EntityUtils.prototype.hasEmptyId(item) ? "" : item.id;
        return {htmlId: htmlId, item: item};
    }
}