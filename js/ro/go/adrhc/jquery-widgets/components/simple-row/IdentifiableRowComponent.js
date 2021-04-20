class IdentifiableRowComponent extends SimpleRowComponent {
    static SECONDARY_ROW_PART = "secondary-row-part";

    /**
     * @param elemIdOrJQuery
     * @param bodyRowTmplId
     * @param bodyRowTmplHtml
     * @param bodyTmplHtml
     * @param rowDataId
     * @param {"prepend"|"append"} rowPositionOnCreate
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
                    elemIdOrJQuery,
                    bodyRowTmplId,
                    bodyRowTmplHtml,
                    bodyTmplHtml,
                    rowDataId,
                    rowPositionOnCreate,
                    childProperty,
                    clearChildrenOnReset,
                    errorRowTmplId,
                    errorRowTmplHtml,
                    config = ComponentConfiguration.configWithOverrides(
                        elemIdOrJQuery, DomUtils.dataOf(bodyRowTmplId), {
                            bodyRowTmplId,
                            bodyRowTmplHtml,
                            bodyTmplHtml,
                            rowDataId,
                            rowPositionOnCreate,
                            childProperty,
                            clearChildrenOnReset,
                            errorRowTmplId,
                            errorRowTmplHtml
                        }),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, config),
                    view = new SimpleRowView(mustacheTableElemAdapter),
                    initialState,
                    state = new TaggingStateHolder({initialState}),
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent
                }) {
        // the "super" missing parameters (e.g. bodyRowTmplId) are included in "config" or they are
        // simply intermediate values (e.g. elemIdOrJQuery is used to compute mustacheTableElemAdapter)
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
        console.log(`removing rows with owner = ${this.simpleRowView.owner} and ${IdentifiableRowComponent.SECONDARY_ROW_PART} = ${rowId}`);
        this.simpleRowView.$getOwnedRowByData(IdentifiableRowComponent.SECONDARY_ROW_PART, rowId).remove();
    }
}