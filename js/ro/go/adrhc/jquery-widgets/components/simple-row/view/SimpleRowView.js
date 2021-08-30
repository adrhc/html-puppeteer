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
        const newEntityRow = stateChange.newStateOrPart;
        const previousEntityRow = stateChange.previousStateOrPart;
        AssertionUtils.isFalse(newEntityRow == null,
            `This change should be handled by deleteRowByDataId!\n${JSON.stringify(previousEntityRow)}`);
        const rowIndexChanged = newEntityRow?.index !== previousEntityRow?.index;
        AssertionUtils.isTrue(!rowIndexChanged || PositionUtils.areAllButIndexValid(newEntityRow))
        const previousRowId = previousEntityRow?.entity?.id;
        if (rowIndexChanged && !!previousRowId) {
            this.deleteRowByDataId(previousRowId);
        }
        this._updateRow(newEntityRow, stateChange.changeType, previousRowId);
        return Promise.resolve(stateChange);
    }

    _updateRow(entityRow, changeType, previousRowId) {
        this.tableAdapter.renderRowWithTemplate({
            rowDataId: previousRowId ?? entityRow.entity.id,
            rowValues: entityRow,
            rowTmplHtml: this.tableAdapter.bodyRowTmplHtml,
            createIfNotExists: changeType === "CREATE"
        });
        this.$elem = entityRow ? this.tableAdapter.$getRowByDataId(entityRow.entity.id) : undefined;
    }

    /**
     * @param {string|number} rowDataId is the data-id HTML attribute value
     */
    deleteRowByDataId(rowDataId) {
        this.tableAdapter.deleteRowByDataId(rowDataId);
    }

    $getOwnedRowByData(dataKey, dataValue) {
        return this.tableAdapter.$getOwnedRowByData(dataKey, dataValue);
    }
}