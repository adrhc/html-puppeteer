class CrudListComponent extends SelectableElasticListComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRow}
     * @param editableRow {IdentifiableRow}
     * @param deletableRow {IdentifiableRow}
     */
    constructor(mustacheTableElemAdapter,
                repository, state, view,
                readOnlyRow, editableRow, deletableRow) {
        super(mustacheTableElemAdapter, repository, state, view, readOnlyRow, editableRow);
        this.deletableRow = deletableRow;
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    switchToDelete(ev) {
        const selectableList = ev.data;
        const rowDataId = selectableList.view.rowDataIdOf(this, true);
        if (!rowDataId) {
            return;
        }
        ev.stopPropagation();
        selectableList._switchToId(rowDataId);
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @private
     */
    _configureEvents() {
        super._configureEvents();
        this.mustacheTableElemAdapter.$table
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='delete']`, this, this.switchToDelete);
    }
}