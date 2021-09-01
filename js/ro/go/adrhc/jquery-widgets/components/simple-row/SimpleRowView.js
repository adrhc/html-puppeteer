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
        /**
         * @type {EntityRow}
         */
        const previousEntityRow = stateChange.previousStateOrPart;
        const newEntityRow = stateChange.newStateOrPart;
        AssertionUtils.isFalse(newEntityRow == null,
            `Null newEntityRow must be handled by deleteRowByDataId!\npreviousEntityRow:\n${JSON.stringify(previousEntityRow)}`);
        if (previousEntityRow) {
            this._replaceEntityRow(previousEntityRow.entity.id, newEntityRow);
        } else {
            AssertionUtils.isTrue(PositionUtils.areAllButIndexValid(newEntityRow),
                `The relative positioning values must be provided!\n${JSON.stringify(newEntityRow)}`);
            this._createEntityRow(newEntityRow);
        }
        return Promise.resolve(stateChange);
    }

    /**
     * Here entityRow is needed for the positioning properties and its entity.id.
     *
     * @param {EntityRow} entityRow
     * @protected
     */
    _createEntityRow(entityRow) {
        this.tableAdapter.createEntityRow(entityRow);
        this.$elem = this.tableAdapter.$getRowByDataId(entityRow.entity.id);
    }

    /**
     * @param {number|string} rowToReplaceId
     * @param {EntityRow=} entityRow
     * @protected
     */
    _replaceEntityRow(rowToReplaceId, entityRow) {
        this.tableAdapter.replaceEntityRow(rowToReplaceId, entityRow);
        this.$elem = this.tableAdapter.$getRowByDataId(entityRow.entity.id);
    }

    /**
     * @param {string|number} rowDataId is the data-id HTML attribute value
     */
    deleteRowByDataId(rowDataId) {
        this.tableAdapter.deleteRowByDataId(rowDataId);
        this.$elem = undefined;
    }

    $getOwnedRowByData(dataKey, dataValue) {
        return this.tableAdapter.$getOwnedRowByData(dataKey, dataValue);
    }
}