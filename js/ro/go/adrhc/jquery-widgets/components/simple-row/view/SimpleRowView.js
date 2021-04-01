/**
 * This is a view able to compute at each update its $elem and owner but should not reset its
 * tableAdapter because tableAdapter is like a provided configuration managed by someone else.
 *
 * tableAdapter is configuration managed by the provider
 */
class SimpleRowView extends AbstractView {
    /**
     * @type {MustacheTableElemAdapter}
     */
    tableAdapter;

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        super();
        /**
         * @type {MustacheTableElemAdapter}
         */
        this.tableAdapter = mustacheTableElemAdapter;
        this.owner = this.tableAdapter.owner;
    }

    /**
     * @param {TaggedStateChange<EntityRow>} stateChange
     * @return {Promise<TaggedStateChange<EntityRow>>}
     */
    update(stateChange) {
        const rowValues = stateChange.stateOrPart;
        const previousStateOrPart = stateChange.previousStateOrPart;
        const rowIdToSearchFor = previousStateOrPart ? previousStateOrPart.entity.id : rowValues.entity.id;
        this.tableAdapter.renderRowWithTemplate({
            rowDataId: rowIdToSearchFor,
            rowValues,
            rowTmplHtml: this.tableAdapter.bodyRowTmplHtml,
            createIfNotExists: stateChange.changeType === "CREATE",
        });
        this.$elem = rowValues ? this.tableAdapter.$getRowByDataId(rowValues.entity.id) : undefined;
        return Promise.resolve(stateChange);
    }

    deleteRowByDataId(rowDataId) {
        this.tableAdapter.deleteRowByDataId(rowDataId);
    }

    $getOwnedRowByData(dataKey, dataValue) {
        return this.tableAdapter.$getOwnedRowByData(dataKey, dataValue);
    }
}