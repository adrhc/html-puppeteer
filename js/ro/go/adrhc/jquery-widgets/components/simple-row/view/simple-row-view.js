class SimpleRowView extends AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param rowTmpl {string|undefined}
     * @param rowTmplHtml {string|undefined}
     * @param putAtBottomIfNotExists {boolean|undefined}
     */
    constructor(mustacheTableElemAdapter, {
        rowTmpl,
        rowTmplHtml = mustacheTableElemAdapter.bodyRowTmplHtml,
        putAtBottomIfNotExists
    }) {
        super(mustacheTableElemAdapter);
        this.putAtBottomIfNotExists = putAtBottomIfNotExists;
        this.rowTmplHtml = HtmlUtils.prototype.templateOf(rowTmpl, rowTmplHtml);
    }

    /**
     * @param stateChange {SimpleRowStateChange}
     * @return {Promise<SimpleRowStateChange>}
     */
    update(stateChange) {
        const updatedRowState = stateChange.state.rowState;
        const rowStateIsRemoved = stateChange.state.rowStateIsRemoved;
        if (rowStateIsRemoved) {
            this.mustacheTableElemAdapter.deleteRowByDataId(updatedRowState.id);
        } else {
            this.mustacheTableElemAdapter.renderRowBeforeDataId(updatedRowState.id,
                this.rowTmplHtml, updatedRowState, true, this.putAtBottomIfNotExists);
        }
        return Promise.resolve(stateChange);
    }
}