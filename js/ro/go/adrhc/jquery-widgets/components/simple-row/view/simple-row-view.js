class SimpleRowView extends AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param rowTmpl {string|undefined}
     * @param rowTmplHtml {string|undefined}
     * @param tableRelativePositionOnCreate {"prepend"|"append"|undefined}
     */
    constructor(mustacheTableElemAdapter, {
        rowTmpl,
        rowTmplHtml = mustacheTableElemAdapter.bodyRowTmplHtml,
        tableRelativePositionOnCreate
    }) {
        super(mustacheTableElemAdapter);
        this.rowTmplHtml = HtmlUtils.prototype.templateOf(rowTmpl, rowTmplHtml);
        this.tableRelativePositionOnCreate = tableRelativePositionOnCreate;
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    update(stateChange) {
        const updatedRowState = stateChange.data;
        if (stateChange.requestType === "DELETE") {
            this.tableAdapter.deleteRowByDataId(updatedRowState.id);
        } else {
            this.tableAdapter.renderRowWithTemplate({
                rowDataId: updatedRowState.id,
                data: updatedRowState,
                rowTmplHtml: this.rowTmplHtml,
                createIfNotExists: stateChange.requestType === "CREATE",
                tableRelativePosition: this.tableRelativePositionOnCreate
            })
        }
        return Promise.resolve(stateChange);
    }
}