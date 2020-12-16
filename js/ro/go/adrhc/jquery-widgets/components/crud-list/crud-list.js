class CrudListComponent extends SelectableElasticListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SelectableListView}
     * @param deletableRow {IdentifiableRowComponent}
     */
    constructor(repository, state, view, deletableRow) {
        super(repository, state, view);
        this.view.swappingRowSelector["SHOW_DELETE"] = deletableRow;
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
                `${this.ownerSelector}[data-btn='showDelete']`, this, this.switchToDelete);
    }
}