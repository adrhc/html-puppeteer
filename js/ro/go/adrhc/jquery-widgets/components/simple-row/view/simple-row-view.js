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
     * @type {"before"|"after"}
     */
    neighbourRelativePosition;

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param [tableRelativePositionOnCreate] {"prepend"|"append"}
     * @param [neighbourRelativePosition] {"before"|"after"}
     */
    constructor(mustacheTableElemAdapter,
                tableRelativePositionOnCreate, neighbourRelativePosition) {
        super();
        /**
         * @type {MustacheTableElemAdapter}
         */
        this.tableAdapter = mustacheTableElemAdapter;
        this.owner = this.tableAdapter.owner;
        this.tableRelativePositionOnCreate = tableRelativePositionOnCreate;
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
            neighbourRowDataId: this._neighbourRowDataIdOf(stateChange),
            neighbourRelativePosition: this._neighbourRelativePosition(stateChange)
        });
        this.$elem = this.tableAdapter.$getRowByDataId(updatedRowState.id);
        return Promise.resolve(stateChange);
    }

    _neighbourRelativePosition(stateChange) {
        if (!!this.neighbourRelativePosition) {
            return this.neighbourRelativePosition;
        }
        if (!!stateChange.beforeItemId) {
            return "before";
        }
        if (!!stateChange.afterItemId) {
            return "after";
        }
        return undefined;
    }

    _neighbourRowDataIdOf(stateChange) {
        return !!stateChange.beforeItemId ? stateChange.beforeItemId : stateChange.afterItemId;
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {"prepend"|"append"|undefined|string}
     * @protected
     */
    _tableRelativePositionOf(stateChange) {
        if (stateChange.afterItemId == null && stateChange.beforeItemId == null) {
            return this.tableRelativePositionOnCreate;
        }
        if (stateChange.afterItemId != null) {
            return "append";
        }
        if (stateChange.beforeItemId != null) {
            return "prepend";
        }
        return undefined;
    }

    deleteRowByDataId(rowDataId) {
        this.tableAdapter.deleteRowByDataId(rowDataId);
    }

    $getOwnedRowByData(dataKey, dataValue) {
        return this.tableAdapter.$getOwnedRowByData(dataKey, dataValue);
    }
}