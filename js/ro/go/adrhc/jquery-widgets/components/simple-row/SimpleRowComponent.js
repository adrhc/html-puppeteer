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
                    config = ComponentConfiguration
                        .configOf(tableIdOrJQuery, {
                            clearChildrenOnReset: true
                        })
                        .overwriteWith(DomUtils.dataOf(rowTmplId), {
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
        this.setHandlerName("updateViewOnDELETE", "DELETE")
    }

    /**
     * @param {EntityRow} stateOrPart
     * @return {Promise<StateChange[]>}
     */
    update(stateOrPart) {
        const previousState = this.state.currentState;
        this.reset();
        this.state.collectStateChange(new StateChange(previousState, stateOrPart));
        return this.init();
    }

    remove() {
        return this.doWithState(state => {
            state.replaceEntirely(undefined);
        }).then(() => this.reset());
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