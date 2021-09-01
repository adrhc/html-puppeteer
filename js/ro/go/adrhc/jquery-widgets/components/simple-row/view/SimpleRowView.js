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
        const newEntityRow = stateChange.newStateOrPart;
        const previousEntityRow = stateChange.previousStateOrPart;
        AssertionUtils.isFalse(newEntityRow == null,
            `newEntityRow == null must be handled by deleteRowByDataId!\npreviousEntityRow:\n${JSON.stringify(previousEntityRow)}`);
        const previousRowId = previousEntityRow?.entity?.id;
        if (newEntityRow?.index !== previousEntityRow?.index) {
            // row position changed
            if (previousRowId != null) {
                // removing the previous row because it has to be redraw
                // anyway considering that at least its position changed
                this.deleteRowByDataId(previousRowId);
            }
            AssertionUtils.isTrue(PositionUtils.areAllButIndexValid(newEntityRow),
                `The relative positioning values must be provided!\n${JSON.stringify(newEntityRow)}`);
            this._createEntityRow(newEntityRow);
        } else {
            // row position is the same
            if (previousRowId != null) {
                this._replaceEntityRow(previousRowId, newEntityRow);
            } else {
                AssertionUtils.isTrue(PositionUtils.areAllButIndexValid(newEntityRow),
                    `The relative positioning values must be provided!\n${JSON.stringify(newEntityRow)}`);
                this._createEntityRow(newEntityRow);
            }
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