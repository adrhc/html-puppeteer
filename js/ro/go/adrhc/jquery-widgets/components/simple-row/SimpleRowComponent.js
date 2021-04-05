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

    /**
     * The intention is to skip the calls that updateViewOnAny() will make anyway but
     * only when _handleViewUpdateOnInit will determine the call of updateViewOnAny().
     * The fact that _handleInitErrors part is caught twice is not an issue; 2nd catch will basically do nothing.
     *
     * @param {StateChange[]} stateChanges
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _handleEventsConfigurationOnInit(stateChanges) {
        const hasStateChanges = stateChanges && stateChanges.length > 0;
        const lastChangeType = hasStateChanges ? stateChanges[stateChanges.length - 1].changeType : undefined;
        const shouldSkipEventsConfiguration = this.isAllowedToHandleWithAny(lastChangeType);
        return shouldSkipEventsConfiguration ? stateChanges :
            super._handleEventsConfigurationOnInit(stateChanges);
    }

    /**
     * When redrawing a row it means internally to recreate it so to loose all existing handlers
     * set by the row component or its children; this implies that a full re-init is required but
     * that's not easy because _handleViewUpdateOnInit() cals updateViewOnAny() so a circular
     * calling could happen. The solution is to do a init()-like inside updateViewOnAny() while
     * also to skip _handleEventsConfigurationOnInit() when updateViewOnAny() already called.
     *
     * @param {TaggedStateChange} stateChange
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        this.reset();
        this.state.replaceEntirely(stateChange.stateOrPart, true);
        return super.updateViewOnAny(stateChange)
            .then(this._handleEventsConfigurationOnInit.bind(this))
            .catch(this._handleInitErrors.bind(this));
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