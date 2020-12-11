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

    /**
     * @param item {IdentifiableEntity}
     * @param putAtBottomIfNotExists {boolean|undefined}
     */
    show(item, putAtBottomIfNotExists) {
        this.mustacheTableElemAdapter.renderRowBeforeDataId(item.id, this.rowTmplHtml, item, true);
    }

    get owner() {
        return this.mustacheTableElemAdapter.tableId;
    }
}