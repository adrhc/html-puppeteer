/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL and notSelectedRow is not automatically creating the related row,
 * than the next onSwapping will determine swappingState to render as "deselected" the previous
 * item but only if already exists (in table) otherwise nothing will be rendered for it.
 */
class SelectableListComponent extends SimpleListComponent {
    /**
     * @type {SelectableListState}
     */
    selectableListState;
    /**
     * @type {SimpleListView}
     */
    simpleListView;
    /**
     * field having SelectableListEntityExtractor type instead of the generic EntityExtractor type
     *
     * @type {SelectableListEntityExtractor}
     */
    selectableListEntityExtractor;
    /**
     * @type {{}}
     */
    swappingRowSelector;

    /**
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     * @param {ComponentConfiguration} [config]
     */
    constructor(repository, state, view,
                notSelectedRow, selectedRow, config) {
        super(repository, state, view, config);
        this.stateChangesDispatcher.usePartName("Item", "CREATE", "REPLACE", "DELETE");
        this.selectableListState = state;
        this.simpleListView = view;
        this.entityExtractor = new SelectableListEntityExtractor(this, {});
        this.selectableListEntityExtractor = this.entityExtractor;
        /**
         * true/false relates to swappingDetails.isPrevious
         *
         * @type {{false: IdentifiableRowComponent, true: IdentifiableRowComponent}}
         */
        this.swappingRowSelector = {
            false: selectedRow, // e.g. editable-row, deletable-row
            true: notSelectedRow // i.e. read-only row
        };
    }

    /**
     * @param {TaggedStateChange} stateChange
     * @return {Promise<TaggedStateChange[]>}
     */
    updateViewOnKnownItemStateChange(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnCREATEITEM:\n${JSON.stringify(stateChange)}`);
        return this.swappingRowSelector[true].processStateChange(stateChange);
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
        const rowDataId = selectableList.simpleListView.rowDataIdOf(this);
        selectableList.switchTo(rowDataId);
    }

    /**
     * @param context {string|boolean|undefined}
     * @param rowDataId {number|string}
     * @return {Promise<StateChange[]>}
     */
    switchTo(rowDataId, context) {
        return this.doWithState((state) => {
            this.myStateOf(state).switchTo(rowDataId, context);
        });
    }

    /**
     * called by AbstractComponent.updateViewOnStateChange
     * see also this.state.swappingState.changeType (defaults to "SWAP")
     *
     * @param swappingStateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnSWAP(swappingStateChange) {
        /**
         * @type {SwappingDetails}
         */
        const swappingDetails = swappingStateChange.data;
        // e.g. this could be the (previously) edited row whose state is reset
        if (swappingDetails.isPrevious) {
            this._resetPreviousRow(swappingDetails);
        }
        // item could be undefined when "previously" is a saved transient item which after
        // SelectableListState._reloadLastSwappedOffItem is set to undefined; same happens
        // when removing an item
        if (!swappingDetails.data.item) {
            return Promise.resolve(undefined);
        }
        // e.g. this could be the read-only row which is shown over the edited row (meanwhile reset anyway)
        return this._rowPickAndUpdate(swappingDetails).then(() => swappingStateChange);
    }

    /**
     * Because the selected row (the html element) is a different one at each selection
     * that's why we have to use init(); otherwise we could use processStateChangeWithKids
     * to only update the kids view (and state).
     *
     * @param swappingDetails {SwappingDetails}
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _rowPickAndUpdate(swappingDetails) {
        const rowComponent = this._rowComponentFor(swappingDetails);
        rowComponent.simpleRowState.update(swappingDetails.data.item);
        return rowComponent.init();
    }

    /**
     * The closing must be performed by the specific selected row: could be based on swapping context
     * or could be the default (i.e. swappingRowSelector[false] = selectedRow).
     *
     * @param swappingDetails {SwappingDetails}
     * @protected
     */
    _resetPreviousRow(swappingDetails) {
        // swappingDetails.data is {EntityRowSwap}
        const context = !!swappingDetails.data.context ? swappingDetails.data.context : false;
        /**
         * @type {IdentifiableRowComponent}
         */
        const identifiableRow = this.swappingRowSelector[context];
        // removeSecondaryRowParts needs existing state which is reset by reset()
        // so we need to call removeSecondaryRowParts before identifiableRow.reset()
        identifiableRow.removeSecondaryRowParts();
        identifiableRow.reset();
    }

    /**
     * @param swappingDetails {SwappingDetails}
     * @return {IdentifiableRowComponent} to be use with swappingDetails
     * @protected
     */
    _rowComponentFor(swappingDetails) {
        // swappingDetails.data is {EntityRowSwap}
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
     * The specific row though depend on the EntityRowSwap.context if
     * present otherwise is the this.swappingRowSelector[false].
     *
     * @return {IdentifiableRowComponent} responsible for the currently "selected" row
     */
    get selectedRowComponent() {
        const selectableSwappingData = this.selectableListState.currentSelectableSwappingData;
        if (!selectableSwappingData) {
            return undefined;
        }
        // swappingRowSelector is true/false based where false means "active" (also means that isPrevious is false)
        const context = !!selectableSwappingData.context ? selectableSwappingData.context : false;
        return this.swappingRowSelector[context];
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @protected
     */
    configureEvents() {
        super.configureEvents();
        this.simpleListView.$elem
            .on(this._appendNamespaceTo("dblclick"),
                `tr${this._ownerSelector}`, this, this.onSwapping);
    }

    /**
     * @param {StateHolder} state
     * @return {SelectableListState}
     */
    myStateOf(state) {
        return state;
    }
}