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
                    config = RowConfiguration
                        .configOf(elemIdOrJQuery, {
                            clearChildrenOnReset: true
                        })
                        .overwriteWith({
                            bodyRowTmplId,
                            bodyRowTmplHtml,
                            bodyTmplHtml,
                            rowDataId,
                            rowPositionOnCreate,
                            childProperty,
                            clearChildrenOnReset
                        }, DomUtils.dataOf(bodyRowTmplId ? $(`#${bodyRowTmplId}`) : bodyRowTmplHtml ? $(bodyRowTmplHtml) : undefined)),
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
     * @return {Promise<StateChange>}
     */
    remove() {
        return this.doWithState(state => {
            state.replaceEntirely(undefined);
        });
    }

    /**
     * The intention is to skip those calls that updateViewOnAny() will do anyway but
     * only for the case when _handleViewUpdateOnInit() will call updateViewOnAny().
     * The fact that _handleInitErrors part will in the end be called twice is not
     * an issue; 2nd catch will basically do nothing.
     *
     * ASSUMPTION: init() will call _handleInitErrors() after calling _configureEventsAndInitKidsOnInit()
     *
     * @param {StateChange[]} stateChanges
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _configureEventsAndInitKidsOnInit(stateChanges) {
        const hasStateChanges = stateChanges && stateChanges.length > 0;
        const lastChangeType = hasStateChanges ? stateChanges[stateChanges.length - 1].changeType : undefined;
        const shouldSkipEventsConfiguration = this.isAllowedToHandleWithAny(lastChangeType);
        return shouldSkipEventsConfiguration ? stateChanges :
            super._configureEventsAndInitKidsOnInit(stateChanges);
    }

    /**
     * Redrawing a row internally means to recreate it so to loose all existing event handlers
     * set by the row component or its children; this implies that a full re-init is required but
     * that's not easy because _handleViewUpdateOnInit() cals updateViewOnAny() so a circular
     * calling could happen. The solution is to do a init()-like inside updateViewOnAny() while
     * also to skip _configureEventsAndInitKidsOnInit() when updateViewOnAny() already called.
     *
     * reminder: _handleViewUpdateOnInit() calls updateViewOnAny()
     *
     * @param {TaggedStateChange} stateChange
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        this.reset();
        this.state.replaceEntirely(stateChange.stateOrPart, {dontRecordStateEvents: true});
        return super.updateViewOnAny(stateChange)
            .then(super._configureEventsAndInitKidsOnInit.bind(this))
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