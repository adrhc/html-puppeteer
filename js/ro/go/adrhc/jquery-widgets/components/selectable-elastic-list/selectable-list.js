/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL, and notSelectedRow is not automatically creating the related row,
 * than the next onSwapping will determine swappingState to render as "deselected" the previous
 * item but only if already exists (its row) otherwise nothing will be rendered for it.
 */
class SelectableListComponent extends ElasticListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param view {SelectableListView}
     */
    constructor(repository, state, view) {
        super(repository, state, view, view.notSelectedRow);
    }

    init() {
        return super.init().then(() => this._configureEvents());
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onSwapping(ev) {
        const selectableList = ev.data;
        if (!$(this).is("tr,td,th")) {
            return;
        }
        ev.stopPropagation();
        const rowDataId = selectableList.rowDataIdOf(this);
        selectableList._doSwapWith(rowDataId);
    }

    /**
     * @param rowDataId {string|number}
     * @param context relates to SelectableListState.switchTo(id, context)
     * @protected
     */
    _doSwapWith(rowDataId, context) {
        this.state.switchTo(rowDataId, context);
        return this.updateViewOnStateChanges();
    }

    updateViewOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        console.log("SelectableListComponent.updateViewOnStateChange\n", JSON.stringify(stateChange));
        switch (stateChange.requestType) {
            case this.swappingRequestType:
                return this.updateViewOnSwapping(stateChange);
            default:
                console.warn(`SelectableElasticListComponent delegating view update to super for ${stateChange.requestType}`)
                return super.updateViewOnStateChange(stateChange);
        }
    }

    /**
     * Updates the view on 1x "swapping" state change.
     *
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnSwapping(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        return this.view.updateViewOnSwapping(stateChange);
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @protected
     */
    _configureEvents() {
        this.tableAdapter.$table
            .on(this.withNamespaceFor('dblclick'),
                `tr${this.ownerSelector}`, this, this.onSwapping);
    }

    /**
     * @return {string}
     */
    get swappingRequestType() {
        return this.state.swappingState.requestType;
    }
}