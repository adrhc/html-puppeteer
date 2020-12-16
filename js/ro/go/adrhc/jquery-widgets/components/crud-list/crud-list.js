class CrudListComponent extends SelectableElasticListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRow}
     * @param editableRow {IdentifiableRow}
     * @param deletableRow {IdentifiableRow}
     */
    constructor(repository, state, view,
                readOnlyRow, editableRow, deletableRow) {
        super(repository, state, view, readOnlyRow, editableRow);
        this._swappingContextAwareRowSelector = {
            "SHOW_DELETE": deletableRow
        }
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    switchToDelete(ev) {
        const selectableList = ev.data;
        const rowDataId = selectableList.rowDataIdOf(this, true);
        if (!rowDataId) {
            return;
        }
        ev.stopPropagation();
        selectableList._switchToId(rowDataId, "SHOW_DELETE");
    }

    /**
     * @param stateChange
     * @return {Promise<StateChange>}
     * @protected
     */
    _updateOnSelect(stateChange) {
        const onOff = stateChange.state;
        const selectableOnOffData = onOff.data;
        if (!onOff.isPrevious && selectableOnOffData.context) {
            return this._swappingContextAwareRowSelector[selectableOnOffData.context].update(selectableOnOffData.item);
        } else {
            return super._updateOnSelect(stateChange);
        }
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @private
     */
    _configureEvents() {
        super._configureEvents();
        this.tableAdapter.$table
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='delete']`, this, this.switchToDelete);
    }
}