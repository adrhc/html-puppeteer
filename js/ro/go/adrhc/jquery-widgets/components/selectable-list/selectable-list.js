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
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     */
    constructor(repository, state, view,
                notSelectedRow, selectedRow) {
        super(repository, state, view, notSelectedRow);
        // true/false relates to swappingDetails.isPrevious
        this.swappingRowSelector = {
            false: selectedRow,
            true: notSelectedRow
        };
    }

    /**
     * @return {Promise<StateChange>}
     */
    init() {
        return super.init()
            .then((stateChange) => {
                this._configureEvents();
                return stateChange;
            });
    }

    reload() {
        return super.reload();
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
                return this.updateComponentsOnSwapping(stateChange);
            default:
                console.warn(`SelectableElasticListComponent delegating view update to super for ${stateChange.requestType}`)
                return super.updateViewOnStateChange(stateChange);
        }
    }

    /**
     * Updates the selected component on 1x "swapping" state change.
     *
     * @param swappingStateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateComponentsOnSwapping(swappingStateChange) {
        swappingStateChange = swappingStateChange ? swappingStateChange : this.swappingState.consumeOne();
        if (!swappingStateChange) {
            return Promise.resolve(swappingStateChange);
        }
        return this._updateSelectedView(swappingStateChange);
    }

    /**
     * Calls "update" on the selected component.
     *
     * @param swappingStateChange
     * @return {Promise<StateChange>}
     * @protected
     */
    _updateSelectedView(swappingStateChange) {
        const swappingDetails = swappingStateChange.data;
        const swappingData = swappingDetails.data;
        if (swappingData.item) {
            const rowComponent = this._rowComponentOf(swappingStateChange);
            return rowComponent
                .init()
                .then(() => rowComponent.update(swappingData.item))
                .then(() => swappingStateChange);
        } else {
            return Promise.resolve(swappingStateChange);
        }
    }

    /**
     * Selects the row to display based on swappingDetails.isPrevious and swappingDetails.swappingData.context.
     *
     * @param swappingStateChange {StateChange}
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _rowComponentOf(swappingStateChange) {
        const swappingDetails = swappingStateChange.data;
        const swappingData = swappingDetails.data;
        if (!swappingDetails.isPrevious && swappingData.context) {
            return this.swappingRowSelector[swappingData.context];
        } else {
            return this.swappingRowSelector[swappingDetails.isPrevious];
        }
    }

    /**
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     */
    extractSelectionInputValues(useOwnerOnFields) {
        const selectableSwappingData = this.state.currentSelectableSwappingData;
        // swappingRowSelector is true/false based where false means "active" and relates to "isPrevious"
        const context = selectableSwappingData.context ? selectableSwappingData.context : false;
        return this.swappingRowSelector[context].extractInputValues(useOwnerOnFields);
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