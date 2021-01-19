/**
 * This is a view able to compute at each update its $elem and owner but unable to reset its tableAdapter;
 * it's almost like a stateless view, the $elem and owner are useful only when updating the view.
 */
class SimpleRowView extends AbstractView {
    /**
     * @type {MustacheTableElemAdapter}
     */
    tableAdapter;
    /**
     * @type {"prepend"|"append"|undefined}
     */
    tableRelativePositionOnCreate;

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param tableRelativePositionOnCreate {"prepend"|"append"|undefined}
     */
    constructor(mustacheTableElemAdapter, tableRelativePositionOnCreate) {
        super();
        /**
         * @type {MustacheTableElemAdapter}
         */
        this.tableAdapter = mustacheTableElemAdapter;
        this.owner = this.tableAdapter.owner;
        this.rowTmplHtml = mustacheTableElemAdapter.bodyRowTmplHtml;
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
        });
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

    deleteRowByDataId(rowDataId) {
        this.tableAdapter.deleteRowByDataId(rowDataId);
    }

    $getOwnedRowByData(dataKey, dataValue) {
        return this.tableAdapter.$getOwnedRowByData(dataKey, dataValue);
    }

    /**
     * reset $elem but keep the rest:
     * tableAdapter, owner (which anyway makes sense only with its associated tableAdapter) and the table's event bindings
     */
    reset() {
        this.$elem = undefined;
    }
}