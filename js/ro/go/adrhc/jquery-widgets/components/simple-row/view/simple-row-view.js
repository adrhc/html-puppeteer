class SimpleRowView extends AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param rowTmpl {string|undefined}
     * @param rowTmplHtml {string|undefined}
     * @param removeOnEmptyState {boolean|undefined}
     * @param putAtBottomIfNotExists {boolean|undefined}
     */
    constructor(mustacheTableElemAdapter, {
        rowTmpl,
        rowTmplHtml = mustacheTableElemAdapter.bodyRowTmplHtml,
        removeOnEmptyState = false,
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
        const updatedRowStateIsDueToRemove = stateChange.state.updatedRowStateIsDueToRemove;
        if (updatedRowStateIsDueToRemove) {
            this.mustacheTableElemAdapter.deleteRowByDataId(updatedRowState.id);
        } else if (updatedRowState) {
            this.mustacheTableElemAdapter.renderRowBeforeDataId(updatedRowState.id,
                this.rowTmplHtml, updatedRowState, true, this.putAtBottomIfNotExists);
        } else if (this.removeOnEmptyState && previousRowState) {
            this.mustacheTableElemAdapter.deleteRowByDataId(previousRowState.id);
        }
        return Promise.resolve(stateChange);
    }
}