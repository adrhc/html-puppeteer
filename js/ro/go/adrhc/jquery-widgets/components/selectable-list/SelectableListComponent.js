/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL and notSelectedRow is not automatically creating the related row,
 * than the next onSwitch will determine swappingState to render as "deselected" the previous
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
        this.stateChangesDispatcher.usePartName("Item");
        this.stateChangesDispatcher.partChangeHandlers.setHandlerName("onItemChange", "CREATE", "REPLACE", "DELETE");
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
            ON: selectedRow, // e.g. editable-row, deletable-row
            OFF: notSelectedRow // i.e. read-only row
        };
        this.notSelectedRow = notSelectedRow;
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onSwitch(ev) {
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
            this.castState(state).switchTo(rowDataId, context);
        });
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<TaggedStateChange[]>}
     */
    onItemChange(stateChange) {
        console.log(`${this.constructor.name}.onItemChange:\n${JSON.stringify(stateChange)}`);
        return this.notSelectedRow.processStateChanges(stateChange);
    }

    updateViewOnItemOFF(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnItemOFF:\n${JSON.stringify(stateChange)}`);
        const removeOnRow = new DeleteStateChange(stateChange.stateOrPart);
        const createOffRow = new CreateStateChange(stateChange.stateOrPart);
        return this.swappingRowSelector[SwitchType.OFF].processStateChanges(removeOnRow, createOffRow);
    }

    updateViewOnItemON(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnItemON:\n${JSON.stringify(stateChange)}`);
        stateChange = new CreateStateChange(stateChange.stateOrPart);
        return this.swappingRowSelector[SwitchType.ON].processStateChanges(stateChange);
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     *
     * @protected
     */
    _configureEvents() {
        super._configureEvents();
        this.simpleListView.$elem
            .on(this._appendNamespaceTo("dblclick"),
                `tr${this._ownerSelector}`, this, this.onSwitch);
    }

    /**
     * @param {StateHolder} state
     * @return {SelectableListState}
     */
    castState(state) {
        return state;
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
}