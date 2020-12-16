class CrudListComponent extends SelectableElasticListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SelectableListView}
     * @param deletableRow {IdentifiableRowComponent}
     */
    constructor(repository, state, view, deletableRow) {
        super(repository, state, view);
        this.view.swappingRowSelector["showAdd"] = this.view.swappingRowSelector[true];
        this.view.swappingRowSelector["showDelete"] = deletableRow;
        this.view.swappingRowSelector["showEdit"] = this.view.swappingRowSelector[false];
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onButton(ev) {
        const selectableList = ev.data;
        const rowDataId = selectableList.rowDataIdOf(this, true);
        const context = $(this).data("btn");
        if (!rowDataId || !context) {
            return;
        }
        ev.stopPropagation();
        // showEdit context should match the context used for row double-click in SelectableElasticListComponent
        selectableList._doSwap(rowDataId, context === "showEdit" ? undefined : context);
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @private
     */
    _configureEvents() {
        super._configureEvents();
        this.tableAdapter.$table
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='showAdd'],
                ${this.ownerSelector}[data-btn='showDelete'],
                ${this.ownerSelector}[data-btn='showEdit']`, this, this.onButton);
    }
}