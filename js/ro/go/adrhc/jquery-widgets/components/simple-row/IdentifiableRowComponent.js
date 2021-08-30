class IdentifiableRowComponent extends SimpleRowComponent {
    static SECONDARY_ROW_PART = "secondary-row-part";

    /**
     * @param elemIdOrJQuery is the table
     * @param bodyRowTmplId
     * @param bodyRowTmplHtml
     * @param bodyTmplHtml is used for creating mustacheTableElemAdapter's default value
     * @param rowDataId
     * @param {"prepend"|"append"} rowPositionOnCreate
     * @param childProperty
     * @param clearChildrenOnReset
     * @param {SimpleRowView} view
     * @param {TaggingStateHolder=} state
     * @param {RowConfiguration=} config
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
                    config = new RowConfiguration({
                        elemIdOrJQuery,
                        bodyRowTmplId,
                        bodyRowTmplHtml,
                        bodyTmplHtml,
                        rowDataId,
                        rowPositionOnCreate,
                        childProperty,
                        clearChildrenOnReset,
                    }),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter({elemIdOrJQuery, ...config}),
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

    updateViewOnAny(stateChange) {
        this._removeSecondaryRowParts(stateChange.newStateOrPart.entity.id);
        return super.updateViewOnAny(stateChange);
    }

    updateViewOnDELETE(stateChange) {
        this._removeSecondaryRowParts(stateChange.previousStateOrPart?.entity.id);
        return super.updateViewOnDELETE(stateChange);
    }

    _removeSecondaryRowParts(rowId) {
        if (rowId == null) {
            return;
        }
        console.log(`removing rows with owner = ${this.simpleRowView.owner} and ${IdentifiableRowComponent.SECONDARY_ROW_PART} = ${rowId}`);
        this.simpleRowView.$getOwnedRowByData(IdentifiableRowComponent.SECONDARY_ROW_PART, rowId).remove();
    }
}