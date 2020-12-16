/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL, and notSelectedRow is not automatically creating the related row,
 * than the next onSwapping will determine swappingState to render as "deselected" the previous
 * item but only if already exists (its row) otherwise nothing will be rendered for it.
 */
class SelectableElasticListComponent extends ElasticSimpleListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     */
    constructor(repository, state, view,
                notSelectedRow, selectedRow) {
        super(repository, state, view, notSelectedRow);
        this._swappingRowSelector = {
            false: selectedRow,
            true: notSelectedRow
        };
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
        selectableList._doSwap(rowDataId, this.swappingRequestType);
    }

    /**
     * @param rowDataId {string|number}
     * @param context relates to SelectableElasticListState.switchTo(id, context)
     * @protected
     */
    _doSwap(rowDataId, context) {
        this.state.switchTo(rowDataId, context);
        this.updateViewOnStateChanges();
    }

    updateViewOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        console.log("SelectableElasticListComponent.updateViewOnStateChange\n", JSON.stringify(stateChange));
        switch (stateChange.requestType) {
            case this.swappingRequestType:
                return this._updateViewOnSwapping(stateChange);
            default:
                console.warn(`SelectableElasticListComponent delegating view update to super for ${stateChange.requestType}`)
                return super.updateViewOnStateChange(stateChange);
        }
    }

    /**
     * @param swappingStateChange
     * @return {Promise<StateChange>}
     * @protected
     */
    _updateViewOnSwapping(swappingStateChange) {
        const swappingDetails = swappingStateChange.data;
        const swappingData = swappingDetails.data;
        if (swappingData.item) {
            return this._rowComponentOf(swappingStateChange).update(swappingData.item);
        } else {
            return Promise.resolve(swappingStateChange);
        }
    }

    /**
     * Selects from _swappingRowSelector based on swappingDetails.isPrevious and swappingDetails.swappingData.context.
     *
     * @param swappingStateChange {StateChange}
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _rowComponentOf(swappingStateChange) {
        const swappingDetails = swappingStateChange.data;
        const swappingData = swappingDetails.data;
        if (!swappingDetails.isPrevious && swappingData.context) {
            return this._swappingRowSelector[swappingData.context];
        } else {
            return this._swappingRowSelector[swappingDetails.isPrevious];
        }
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