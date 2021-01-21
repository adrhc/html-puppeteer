/**
 * This is a view able to compute at each update its $elem and owner but should not reset its
 * tableAdapter because tableAdapter is like a provided configuration managed by someone else.
 *
 * tableAdapter, tableRelativePositionOnCreate are configurations managed by the provider
 */
class SimpleRowView extends AbstractView {
    /**
     * @type {MustacheTableElemAdapter}
     */
    tableAdapter;
    /**
     * @type {"prepend"|"append"}
     */
    tableRelativePositionOnCreate;
    /**
     * @type {function(): number|string}
     */
    neighbourRowDataIdSupplier;
    /**
     * @type {"before"|"after"}
     */
    neighbourRelativePosition;

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param [tableRelativePositionOnCreate] {"prepend"|"append"}
     * @param [neighbourRowDataIdSupplier] {function(): number|string}
     * @param [neighbourRelativePosition] {"before"|"after"}
     */
    constructor(mustacheTableElemAdapter, tableRelativePositionOnCreate,
                neighbourRowDataIdSupplier, neighbourRelativePosition) {
        super();
        /**
         * @type {MustacheTableElemAdapter}
         */
        this.tableAdapter = mustacheTableElemAdapter;
        this.owner = this.tableAdapter.owner;
        this.tableRelativePositionOnCreate = tableRelativePositionOnCreate;
        this.neighbourRowDataIdSupplier = neighbourRowDataIdSupplier;
        this.neighbourRelativePosition = neighbourRelativePosition;
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
            rowTmplHtml: this.tableAdapter.bodyRowTmplHtml,
            createIfNotExists: stateChange.requestType === "CREATE",
            tableRelativePosition: this._tableRelativePositionOf(stateChange),
            neighbourRowDataId: this.neighbourRowDataIdSupplier(),
            neighbourRelativePosition: this.neighbourRelativePosition
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
}