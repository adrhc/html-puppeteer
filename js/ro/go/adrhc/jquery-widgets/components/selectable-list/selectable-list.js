/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL, and notSelectedRow is not automatically creating the related row,
 * than the next onSwapping will determine swappingState to render as "deselected" the previous
 * item but only if already exists (its row) otherwise nothing will be rendered for it.
 */
class SelectableListComponent extends ElasticListComponent {
    /**
     * @type {SelectableListState}
     */
    selectableListState;

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
        this.selectableListState = state;
        // true/false relates to swappingDetails.isPrevious
        this.swappingRowSelector = {
            false: selectedRow,
            true: notSelectedRow
        };
    }

    /**
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        return super.init()
            .then((stateChanges) => {
                this._configureEvents();
                return stateChanges;
            });
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
        selectableList._switchTo(rowDataId);
    }

    /**
     * @param rowDataId {string|number}
     * @param context relates to SelectableListState.switchTo(id, context)
     * @protected
     */
    _switchTo(rowDataId, context) {
        this.selectableListState.switchTo(rowDataId, context);
        // changes are: deactivation (previous item) and activation (the selection)
        return this.updateViewOnStateChanges();
    }

    /**
     * called by AbstractComponent.updateViewOnStateChange
     * calls "update" on the "selected" component
     * see also this.state.swappingState.requestType (defaults to "SWAP")
     *
     * @param swappingStateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnSWAP(swappingStateChange) {
        /**
         * swappingStateChange.data is SwappingDetails
         * @type {SelectableSwappingData}
         */
        const swappingData = swappingStateChange.data.data;
        if (swappingData.item) {
            const rowComponent = this._rowComponentFor(swappingStateChange);
            return rowComponent
                .init()
                .then(() => rowComponent.update(swappingData.item, "UPDATE"))
                .then(() => swappingStateChange);
        } else {
            // swapping to nothing: used to swap-off the previous selection
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
    _rowComponentFor(swappingStateChange) {
        /**
         * @type {SwappingDetails}
         */
        const swappingDetails = swappingStateChange.data;
        /**
         * @type {SelectableSwappingData}
         */
        const swappingData = swappingDetails.data;
        if (!swappingDetails.isPrevious && swappingData.context) {
            // this is the current/active selection; depending on "context" a row component or another would be used
            return this.swappingRowSelector[swappingData.context];
        } else {
            // this is the inactive/deactivated/previous selection
            // todo: consider using the context here too
            return this.swappingRowSelector[swappingDetails.isPrevious];
        }
    }

    get _selectedRowComponent() {
        const selectableSwappingData = this.selectableListState.currentSelectableSwappingData;
        // swappingRowSelector is true/false based where false means "active" (also means that isPrevious is false)
        const context = selectableSwappingData.context ? selectableSwappingData.context : false;
        return this.swappingRowSelector[context];
    }

    /**
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     */
    extractSelectionInputValues(useOwnerOnFields) {
        return this._selectedRowComponent.extractInputValues(useOwnerOnFields);
    }

    /**
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     */
    extractSelectionEntity(useOwnerOnFields) {
        return this._selectedRowComponent.extractEntity(useOwnerOnFields);
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @protected
     */
    _configureEvents() {
        this.tableAdapter.$table
            .on(this._withNamespaceFor('dblclick'),
                `tr${this.ownerSelector}`, this, this.onSwapping);
    }
}