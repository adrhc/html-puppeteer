class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @type {AbstractComponent}
     */
    errorComponent;

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
     * @param {AbstractComponent=} errorComponent
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
                    childishBehaviour,
                    errorComponent
                }) {
        super({view, state, config, childCompFactories, childishBehaviour});
        this._setupErrorComponent(errorComponent);
    }

    /**
     * todo: change this approach
     *
     * @param errorComponent
     * @protected
     */
    _setupErrorComponent(errorComponent) {
        const errorRowTmplId = this.config.errorRowTmplId;
        const errorRowTmplHtml = this.config.errorRowTmplHtml;
        if (errorComponent) {
            this.errorComponent = errorComponent;
        } else if (!errorRowTmplId && !errorRowTmplHtml) {
            this.errorComponent = undefined;
        } else {
            this.errorComponent = new IdentifiableRowComponent({
                tableIdOrJQuery: this.simpleRowView.tableAdapter.$table,
                childishBehaviour: new ChildishBehaviour(this),
                rowTmplId: errorRowTmplId,
                rowTmplHtml: errorRowTmplHtml
            });
        }
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