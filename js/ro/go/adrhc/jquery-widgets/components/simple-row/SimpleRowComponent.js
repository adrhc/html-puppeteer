/**
 * "state" is a EntityRow
 */
class SimpleRowComponent extends AbstractComponent {
    /**
     * @type {SimpleRowState}
     */
    state;
    /**
     * @type {SimpleRowView}
     */
    view;

    /**
     * @return {SimpleRowView}
     */
    get simpleRowView() {
        return this.view;
    }

    /**
     * @param {{}} options
     */
    constructor(options) {
        super({clearChildrenOnReset: true, dontAutoInitialize: true, ...options});
        Object.assign(this, this.defaults);
        const mustacheTableElemAdapter = this.defaults.mustacheTableElemAdapter
            ?? new MustacheTableElemAdapter(this.defaults);
        this.view = this.defaults.view ?? new SimpleRowView(mustacheTableElemAdapter);
        this.state = this.defaults.state ?? new SimpleRowState(this.defaults);
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
        // this.reset();
        // this.state.replaceEntirely(stateChange.newStateOrPart, {dontRecordStateEvents: true});
        return super.updateViewOnAny(stateChange)
            .then(this._configureEventsAndInitKidsOnInit.bind(this))
            .catch(this._handleInitErrors.bind(this));
    }

    /**
     * @param {StateChange} stateChange
     * @return {Promise<StateChange>}
     */
    updateViewOnDELETE(stateChange) {
        this.simpleRowView.deleteRowByDataId(stateChange.previousStateOrPart.entity.id);
        this.childishBehaviour?.leaveTheParent();
        this.reset(); // kids are also reset
        return Promise.resolve(stateChange);
    }
}