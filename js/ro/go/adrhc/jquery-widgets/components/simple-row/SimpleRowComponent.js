/**
 * "state" is a EntityRow
 */
class SimpleRowComponent extends AbstractComponent {
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;

    /**
     * @param elemIdOrJQuery
     * @param bodyRowTmplId
     * @param bodyRowTmplHtml
     * @param bodyTmplHtml
     * @param rowDataId
     * @param rowPositionOnCreate
     * @param childProperty
     * @param clearChildrenOnReset
     * @param mustacheTableElemAdapter
     * @param initialState
     * @param {TaggingStateHolder} state
     * @param {SimpleRowView=} view
     * @param childCompFactories
     * @param childishBehaviour
     * @param {ComponentConfiguration=} config
     * @param compositeBehaviour
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
                    config = ComponentConfiguration
                        .configOf(elemIdOrJQuery, {
                            clearChildrenOnReset: true
                        })
                        .overwriteWith(DomUtils.dataOf(bodyRowTmplId), {
                            bodyRowTmplId,
                            bodyRowTmplHtml,
                            bodyTmplHtml,
                            rowDataId,
                            rowPositionOnCreate,
                            childProperty,
                            clearChildrenOnReset
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
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent,
            config: config.dontAutoInitializeOf()
        });
        this.config = config; // the "config" set by "super" is different (see line above)
        this.simpleRowView = view;
        this.handleWithAny(true);
        this.setHandlerName("updateViewOnDELETE", "DELETE")
    }

    /**
     * If previous state would be equal to stateOrPart than state.replaceEntirely would yield no state change
     * so init() will do nothing (_configureEvents(), compositeBehaviour.init() won't be called). This though
     * won't happen for stateOrPart != null because after reset() the previous state would be undefined so
     * state.replaceEntirely will yield a state change after all. The stateOrPart = null clearly means
     * row-remove so it's safe to directly call this.remove().
     *
     * @param {EntityRow} stateOrPart
     * @return {Promise<StateChange>|Promise<StateChange>[]}
     */
    update(stateOrPart) {
        if (stateOrPart == null) {
            return this.remove();
        }
        this.reset();
        this.state.replaceEntirely(stateOrPart);
        return this.init();
    }

    /**
     * @return {Promise<StateChange>}
     */
    remove() {
        return this.doWithState(state => {
            state.replaceEntirely(undefined);
        });
    }

    /*updateViewOnAny(stateChange) {

    }*/

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