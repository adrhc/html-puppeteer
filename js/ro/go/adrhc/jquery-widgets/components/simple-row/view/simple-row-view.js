class SimpleRowView extends AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param rowTmpl {string}
     * @param rowTmplHtml {string}
     * @param removeOnEmptyState {boolean}
     * @param putAtBottomIfNotExists {boolean}
     */
    constructor(mustacheTableElemAdapter, {
        rowTmpl,
        rowTmplHtml = mustacheTableElemAdapter.bodyRowTmplHtml,
        removeOnEmptyState,
        putAtBottomIfNotExists
    }) {
        super(mustacheTableElemAdapter);
        this.putAtBottomIfNotExists = putAtBottomIfNotExists;
        this.rowTmplHtml = HtmlUtils.prototype.templateOf(rowTmpl, rowTmplHtml);
        this.removeOnEmptyState = removeOnEmptyState;
    }

    /**
     * @param stateChange {SimpleRowStateChange}
     * @return {Promise<SimpleRowStateChange>}
     */
    update(stateChange) {
        const previousRowState = stateChange.state.previousRowState;
        const updatedRowState = stateChange.state.updatedRowState;
        if (updatedRowState) {
            this.mustacheTableElemAdapter.renderRowBeforeDataId(updatedRowState.id,
                this.rowTmplHtml, updatedRowState, true, this.putAtBottomIfNotExists);
        } else if (this.removeOnEmptyState && previousRowState) {
            this.mustacheTableElemAdapter.deleteRowByDataId(previousRowState.id);
        }
        return Promise.resolve(stateChange);
    }
}