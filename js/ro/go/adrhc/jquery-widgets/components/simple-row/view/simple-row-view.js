/**
 * This is a view able to compute at each update its $elem and owner but unable to reset its tableAdapter;
 * it's almost like a stateless view, the $elem and owner are useful only when updating the view.
 */
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
        this.$elem = undefined;
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
        this.$elem = this.tableAdapter.$getRowByDataId(updatedRowState.id);
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

    /**
     * keep tableAdapter, owner (which makes sens only with associated tableAdapter) and the associated event bindings
     */
    reset() {
        this.$elem = undefined;
    }
}