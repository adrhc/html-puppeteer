class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @param tableIdOrJQuery
     * @param rowTmplId
     * @param rowTmplHtml
     * @param errorRowTmplId
     * @param errorRowTmplHtml
     * @param childProperty
     * @param {SimpleRowView} view
     * @param {TaggingStateHolder=} state
     * @param {ComponentConfiguration=} config
     * @param mustacheTableElemAdapter
     * @param tableRelativePositionOnCreate
     * @param initialState
     * @param childCompFactories
     * @param childishBehaviour
     */
    constructor({
                    tableIdOrJQuery,
                    rowTmplId,
                    rowTmplHtml,
                    errorRowTmplId,
                    errorRowTmplHtml,
                    childProperty,
                    config = ComponentConfiguration.configWithOverrides(
                        tableIdOrJQuery, DomUtils.dataOf(rowTmplId), {
                            rowTmplId,
                            rowTmplHtml,
                            errorRowTmplId,
                            errorRowTmplHtml,
                            childProperty
                        }),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmplId, rowTmplHtml),
                    tableRelativePositionOnCreate,
                    view = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate),
                    initialState,
                    state = new TaggingStateHolder({initialState}),
                    childCompFactories,
                    childishBehaviour
                }) {
        super({view, state, config, childCompFactories, childishBehaviour});
    }

    updateViewOnDELETE(stateChange) {
        this.removeSecondaryRowParts(stateChange.previousStateOrPart.entity.id);
        return super.updateViewOnDELETE(stateChange);
    }

    removeSecondaryRowParts(rowId) {
        console.log(`removing rows with owner = ${this.simpleRowView.owner} and secondary-row-part = ${rowId}`);
        this.simpleRowView.$getOwnedRowByData("secondary-row-part", rowId).remove();
    }
}