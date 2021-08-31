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
            `This change should be handled by deleteRowByDataId!\n${JSON.stringify(previousEntityRow)}`);
        const positionChanged = newEntityRow?.index !== previousEntityRow?.index;
        const previousRowId = previousEntityRow?.entity?.id;
        let rowToReplaceId;
        if (!!previousRowId && positionChanged) {
            AssertionUtils.isTrue(PositionUtils.areAllButIndexValid(newEntityRow),
                `When changing both identity and position the relative positioning values must be provided!\n${JSON.stringify(newEntityRow)}`);
            this.deleteRowByDataId(previousRowId);
        } else {
            rowToReplaceId = previousRowId;
        }
        this._renderRow(newEntityRow, rowToReplaceId);
        return Promise.resolve(stateChange);
    }

    /**
     * @param {EntityRow} entityRow
     * @param {string=} rowToReplaceId
     * @private
     */
    _renderRow(entityRow, rowToReplaceId) {
        this.tableAdapter.renderRowWithTemplate({rowToReplaceId, entityRow});
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