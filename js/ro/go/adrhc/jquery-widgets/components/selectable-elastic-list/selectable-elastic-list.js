/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL, and notSelectedRow is not automatically creating the related row,
 * than the next onSelectionSwitch will determine swappingState to render as "deselected" the previous
 * item but only if already exists (its row) otherwise nothing will be rendered for it.
 */
class SelectableElasticListComponent extends ElasticSimpleListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRow}
     * @param selectedRow {IdentifiableRow}
     */
    constructor(repository, state, view,
                notSelectedRow, selectedRow) {
        super(repository, state, view, notSelectedRow);
        this._onOffRowSelector = {
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
    onSelectionSwitch(ev) {
        const selectableList = ev.data;
        if (!$(this).is("tr,td,th")) {
            return;
        }
        ev.stopPropagation();
        const rowDataId = selectableList.rowDataIdOf(this);
        selectableList._switchToId(rowDataId, this.selectedRequestType);
    }

    /**
     * @param rowDataId {string|number}
     * @param context relates to SelectableElasticListState.switchTo(id, context)
     * @protected
     */
    _switchToId(rowDataId, context) {
        this.state.switchTo(rowDataId, context);
        this.updateOnStateChanges();
    }

    updateOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        console.log("SelectableElasticListComponent.updateOnStateChange\n", JSON.stringify(stateChange));
        switch (stateChange.requestType) {
            case this.selectedRequestType:
                return this._updateOnSelect(stateChange);
            default:
                console.warn(`SelectableElasticListComponent delegating view update to super for ${stateChange.requestType}`)
                return super.updateOnStateChange(stateChange);
        }
    }

    /**
     * @param stateChange
     * @return {Promise<StateChange>}
     * @protected
     */
    _updateOnSelect(stateChange) {
        const onOff = stateChange.state;
        const selectableOnOffData = onOff.data;
        if (selectableOnOffData.item) {
            return this._onOffRowSelector[onOff.isPrevious].update(selectableOnOffData.item);
        } else {
            return Promise.resolve(stateChange);
        }
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @protected
     */
    _configureEvents() {
        this.tableAdapter.$table
            .on(this.withNamespaceFor('dblclick'),
                `tr${this.ownerSelector}`, this, this.onSelectionSwitch);
    }

    /**
     * @return {string}
     */
    get selectedRequestType() {
        return this.state.swappingState.requestType;
    }
}