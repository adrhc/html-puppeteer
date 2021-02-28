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
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    update(stateChange) {
        /**
         * @type {RowValues}
         */
        const rowState = stateChange.stateOrPart;
        const previousStateOrPart = stateChange.previousStateOrPart;
        const rowIdToSearchFor = previousStateOrPart ? previousStateOrPart.values.id : rowState.values.id;
        this.tableAdapter.renderRowWithTemplate({
            rowDataId: rowIdToSearchFor,
            data: rowState.values,
            rowTmplHtml: this.tableAdapter.bodyRowTmplHtml,
            createIfNotExists: stateChange.changeType === "CREATE",
            tableRelativePosition: this._tableRelativePositionOf(rowState),
            neighbourRowDataId: this._neighbourRowDataIdOf(rowState),
            neighbourRelativePosition: this._neighbourRelativePosition(rowState)
        });
        this.$elem = rowState ? this.tableAdapter.$getRowByDataId(rowState.values.id) : undefined;
        return Promise.resolve(stateChange);
    }

    _neighbourRelativePosition(rowValues) {
        if (!!this.neighbourRelativePosition) {
            return this.neighbourRelativePosition;
        }
        if (!!rowValues.beforeRowId) {
            return "before";
        }
        if (!!rowValues.afterRowId) {
            return "after";
        }
        return undefined;
    }

    _neighbourRowDataIdOf(rowValues) {
        return !!rowValues.beforeRowId ? rowValues.beforeRowId : rowValues.afterRowId;
    }

    /**
     * @param rowValues {RowValues}
     * @return {"prepend"|"append"|undefined|string}
     * @protected
     */
    _tableRelativePositionOf(rowValues) {
        if (rowValues.afterRowId == null && rowValues.beforeRowId == null) {
            return this.tableRelativePositionOnCreate;
        }
        if (rowValues.afterRowId != null) {
            return "append";
        }
        if (rowValues.beforeRowId != null) {
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