class CrudListComponent extends SelectableElasticListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRowComponent}
     * @param editableRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     */
    constructor(repository, state, view,
                readOnlyRow, editableRow, deletableRow) {
        super(repository, state, view, readOnlyRow, editableRow);
        this._swappingRowSelector["SHOW_DELETE"] = deletableRow;
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
        selectableList._doSwap(rowDataId, "SHOW_DELETE");
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