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
     * @param stateChange {PositionStateChange}
     * @return {Promise<PositionStateChange>}
     */
    update(stateChange) {
        /**
         * @type {IdentifiableEntity}
         */
        const updatedRowState = stateChange.data;
        this.tableAdapter.renderRowWithTemplate({
            rowDataId: updatedRowState.id,
            data: updatedRowState,
            rowTmplHtml: this.rowTmplHtml,
            createIfNotExists: stateChange.requestType === "CREATE",
            tableRelativePosition: this._tableRelativePositionOf(stateChange)
        })
        return Promise.resolve(stateChange);
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {"prepend"|"append"|undefined|string}
     * @protected
     */
    _tableRelativePositionOf(stateChange) {
        if (stateChange.afterItemId == null) {
            return this.tableRelativePositionOnCreate;
        }
        return !!stateChange.afterItemId ? "append" : "prepend"
    }
}