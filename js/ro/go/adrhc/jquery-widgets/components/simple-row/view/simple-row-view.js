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
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param [tableRelativePositionOnCreate] {"prepend"|"append"}
     */
    constructor(mustacheTableElemAdapter,
                tableRelativePositionOnCreate) {
        super();
        /**
         * @type {MustacheTableElemAdapter}
         */
        this.tableAdapter = mustacheTableElemAdapter;
        this.owner = this.tableAdapter.owner;
        this.tableRelativePositionOnCreate = tableRelativePositionOnCreate;
    }

    /**
     * @param {TaggedStateChange} stateChange
     * @return {Promise<TaggedStateChange>}
     */
    update(stateChange) {
        /**
         * @type {EntityRow}
         */
        const rowValues = stateChange.stateOrPart;
        const previousStateOrPart = stateChange.previousStateOrPart;
        const rowIdToSearchFor = previousStateOrPart ? previousStateOrPart.entity.id : rowValues.entity.id;
        this.tableAdapter.renderRowWithTemplate({
            rowDataId: rowIdToSearchFor,
            data: rowValues.entity,
            rowTmplHtml: this.tableAdapter.bodyRowTmplHtml,
            createIfNotExists: stateChange.changeType === "CREATE",
            tableRelativePosition: this._tableRelativePositionOf(rowValues),
            index: rowValues.index
        });
        this.$elem = rowValues ? this.tableAdapter.$getRowByDataId(rowValues.entity.id) : undefined;
        return Promise.resolve(stateChange);
    }

    /**
     * @param rowValues {EntityRow}
     * @return {"prepend"|"append"|undefined|string}
     * @protected
     */
    _tableRelativePositionOf(rowValues) {
        if (rowValues.index == null) {
            return this.tableRelativePositionOnCreate;
        }
        return rowValues.index > 0 ? "append" : "prepend";
    }

    deleteRowByDataId(rowDataId) {
        this.tableAdapter.deleteRowByDataId(rowDataId);
    }

    $getOwnedRowByData(dataKey, dataValue) {
        return this.tableAdapter.$getOwnedRowByData(dataKey, dataValue);
    }
}