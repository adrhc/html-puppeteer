class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @param tableIdOrJQuery
     * @param bodyRowTmplId
     * @param bodyRowTmplHtml
     * @param bodyTmplHtml
     * @param rowDataId
     * @param rowDefaultPositionOnCreate
     * @param errorRowTmplId
     * @param errorRowTmplHtml
     * @param childProperty
     * @param clearChildrenOnReset
     * @param {SimpleRowView} view
     * @param {TaggingStateHolder=} state
     * @param {ComponentConfiguration=} config
     * @param mustacheTableElemAdapter
     * @param initialState
     * @param compositeBehaviour
     * @param childCompFactories
     * @param childishBehaviour
     * @param parentComponent
     */
    constructor({
                    tableIdOrJQuery,
                    bodyRowTmplId,
                    bodyRowTmplHtml,
                    bodyTmplHtml,
                    rowDataId,
                    rowDefaultPositionOnCreate,
                    childProperty,
                    clearChildrenOnReset,
                    errorRowTmplId,
                    errorRowTmplHtml,
                    config = ComponentConfiguration.configWithOverrides(
                        tableIdOrJQuery, DomUtils.dataOf(bodyRowTmplId), {
                            bodyRowTmplId,
                            bodyRowTmplHtml,
                            bodyTmplHtml,
                            rowDataId,
                            rowDefaultPositionOnCreate,
                            childProperty,
                            clearChildrenOnReset,
                            errorRowTmplId,
                            errorRowTmplHtml
                        }),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, config),
                    view = new SimpleRowView(mustacheTableElemAdapter),
                    initialState,
                    state = new TaggingStateHolder({initialState}),
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent
                }) {
        // the "super" missing parameters (e.g. bodyRowTmplId) are included in "config" or they are
        // simply intermediate values (e.g. tableIdOrJQuery is used to compute mustacheTableElemAdapter)
        super({
            config,
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent
        });
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