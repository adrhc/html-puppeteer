/**
 * "state" is a EntityRow
 */
class SimpleRowComponent extends AbstractComponent {
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;

    /**
     * @param tableIdOrJQuery
     * @param rowTmplId
     * @param rowTmplHtml
     * @param childProperty
     * @param mustacheTableElemAdapter
     * @param tableRelativePositionOnCreate
     * @param initialState
     * @param {TaggingStateHolder} state
     * @param {SimpleRowView=} view
     * @param childCompFactories
     * @param childishBehaviour
     * @param {ComponentConfiguration=} config
     */
    constructor({
                    tableIdOrJQuery,
                    rowTmplId,
                    rowTmplHtml,
                    childProperty,
                    config = ComponentConfiguration.configWithOverrides(
                        tableIdOrJQuery, DomUtils.dataOf(rowTmplId), {
                            rowTmplId,
                            rowTmplHtml,
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
        super({view, state, childishBehaviour, config: config.dontAutoInitializeOf()});
        this.config = config;
        if (childCompFactories) {
            this.compositeBehaviour.addChildComponentFactory(childCompFactories);
        }
        this.simpleRowView = view;
        this.handleWithAny(true);
    }

    /**
     * todo: a row update would destroy its children and row-events (because the row is deleted-then-created)
     *
     * @param {*} [columnValues]
     * @param {number} [rowIndex]
     * @return {Promise<StateChange[]>}
     */
    updateRow(columnValues, rowIndex = this._defaultRowPosition()) {
        const rowValues = columnValues ? new EntityRow(columnValues, {index: rowIndex}) : undefined;
        this.reset();
        this.state.collectStateChange(new CreateStateChange(rowValues))
        return this.init();
    }

    /**
     * @return {number}
     * @protected
     */
    _defaultRowPosition() {
        return this.simpleRowView.tableRelativePositionOnCreate === "prepend" ? 0 : TableElementAdapter.LAST_ROW_INDEX;
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnDELETE(stateChange) {
        this.simpleRowView.deleteRowByDataId(stateChange.previousStateOrPart.entity.id);
        if (this.childishBehaviour) {
            this.childishBehaviour.detachChild();
        }
        this.reset(); // kids are also reset
        return Promise.resolve(stateChange);
    }
}