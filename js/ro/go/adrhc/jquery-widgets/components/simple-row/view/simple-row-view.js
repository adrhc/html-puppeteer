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
        /**
         * @type {IdentifiableEntity}
         */
        const updatedRowState = stateChange.data;
        const createIfNotExists = stateChange.requestType === "CREATE";
        let tableRelativePosition = this.tableRelativePositionOnCreate;
        if (stateChange instanceof CreateStateChange) {
            tableRelativePosition = this.tableRelativePositionOf(stateChange);
        }
        this.tableAdapter.renderRowWithTemplate({
            rowDataId: updatedRowState.id,
            data: updatedRowState,
            rowTmplHtml: this.rowTmplHtml,
            createIfNotExists,
            tableRelativePosition
        })
        return Promise.resolve(stateChange);
    }

    tableRelativePositionOf(createStateChange) {
        return !!createStateChange.afterItemId ? "append" : "prepend"
    }
}