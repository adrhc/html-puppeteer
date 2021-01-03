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
        selectableList.switchTo(rowDataId);
    }

    /**
     * @param context {string|boolean|undefined}
     * @param rowDataId {number|string}
     */
    switchTo(rowDataId, context) {
        this.doWithState((selectableListState) => {
            if (rowDataId) {
                selectableListState.switchTo(rowDataId, context);
            } else {
                selectableListState.switchToOff();
            }
        });
    }

    /**
     * called by AbstractComponent.updateViewOnStateChange
     * see also this.state.swappingState.requestType (defaults to "SWAP")
     *
     * @param swappingStateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnSWAP(swappingStateChange) {
        /**
         * @type {SwappingDetails}
         */
        const swappingDetails = swappingStateChange.data;
        this._closePreviousRow(swappingDetails);
        return this._rowPickAndRedraw(swappingDetails).then(() => swappingStateChange);
    }

    /**
     * @param swappingDetails {SwappingDetails}
     * @return {Promise<StateChange>}
     * @protected
     */
    _rowPickAndRedraw(swappingDetails) {
        // item could be undefined when "previously" is a saved transient item which after
        // SelectableListState._reloadLastSwappedOffItem) is set to undefined; same happens
        // when removing an item
        const item = swappingDetails.data.item;
        if (!item) {
            return Promise.resolve(undefined);
        }
        const rowComponent = this._rowComponentFor(swappingDetails);
        return rowComponent.init()
            .then(() => rowComponent.update(item, "UPDATE"));
    }

    /**
     * The closing must be performed by the specific selected row: could be based on swapping context
     * or could be the default (i.e. swappingRowSelector[false] = selectedRow).
     *
     * @param swappingDetails {SwappingDetails}
     * @protected
     */
    _closePreviousRow(swappingDetails) {
        // closing previous view (selectedRow)
        if (swappingDetails.isPrevious) {
            // swappingDetails.data is {SelectableSwappingData}
            const context = !!swappingDetails.data.context ? swappingDetails.data.context : false;
            /**
             * @type {IdentifiableRowComponent}
             */
            const identifiableRow = this.swappingRowSelector[context];
            // removeSecondaryRowParts needs existing state which is reset by close()
            // so we need to call removeSecondaryRowParts before identifiableRow.close()
            identifiableRow.removeSecondaryRowParts();
            identifiableRow.close();
        }
    }

    /**
     * @param swappingDetails {SwappingDetails}
     * @return {IdentifiableRowComponent} to be use with swappingDetails
     * @protected
     */
    _rowComponentFor(swappingDetails) {
        // swappingDetails.data is {SelectableSwappingData}
        const swappingContext = swappingDetails.data.context;
        if (!swappingDetails.isPrevious && !!swappingContext) {
            // this is the current/active selection; depending on "context" a row component or another would be used
            return this.swappingRowSelector[swappingContext];
        } else {
            // this is the inactive/deactivated/previous selection or the current/active one with a null context
            // todo: consider using the context for inactive/deactivated/previous too
            return this.swappingRowSelector[swappingDetails.isPrevious];
        }
    }

    /**
     * Returns the IdentifiableRowComponent dealing with an "active" selection.
     * The specific row though depend on the SelectableSwappingData.context if
     * present otherwise is the this.swappingRowSelector[false].
     *
     * @return {IdentifiableRowComponent} responsible for the currently "selected" row
     * @protected
     */
    get _selectedRowComponent() {
        const selectableSwappingData = this.selectableListState.currentSelectableSwappingData;
        // swappingRowSelector is true/false based where false means "active" (also means that isPrevious is false)
        const context = !!selectableSwappingData.context ? selectableSwappingData.context : false;
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