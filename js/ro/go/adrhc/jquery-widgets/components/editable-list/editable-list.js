class EditableListComponent extends SelectableListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {EditableListState}
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
     * SHOW DELETE OR EDIT (aka UPDATE)
     *
     * @param ev {Event}
     */
    onShowDU(ev) {
        const selectableList = ev.data;
        const rowDataId = selectableList.rowDataIdOf(this, true);
        const context = $(this).data("btn");
        if (!rowDataId || !context) {
            return;
        }
        ev.stopPropagation();
        // showEdit context should match the context used for row double-click in SelectableListComponent
        selectableList._doSwapWith(rowDataId, context === "showEdit" ? undefined : context);
    }

    /**
     * SHOW ADD
     *
     * @param ev
     */
    onShowAdd(ev) {
        ev.stopPropagation();
        const selectableList = ev.data;
        selectableList.doWithState((crudListState) => {
            // todo: sync "append" createNewItem param with showAdd.tableRelativePositionOnCreate
            const newId = crudListState.createNewItem().id;
            return selectableList._doSwapWith(newId);
        });
    }

    /**
     * RELOAD
     *
     * @param ev {Event}
     */
    onReload(ev) {
        ev.stopPropagation();
        const selectableList = ev.data;
        selectableList.state.resetSwappingState();
        selectableList.reload();
    }

    /**
     * CANCEL
     *
     * @param ev {Event}
     */
    onCancel(ev) {
        ev.stopPropagation();
        const selectableList = ev.data;
        selectableList._doSwapWith(undefined);
    }

    /**
     * UPDATE
     *
     * @param ev {Event}
     */
    onDelete(ev) {
        ev.stopPropagation();
        const selectableList = ev.data;
        const rowDataId = selectableList.rowDataIdOf(this, true);
        selectableList.repository.delete(rowDataId)
            .then(() => {
                selectableList.doWithState((crudListState) => {
                    crudListState.removeById(rowDataId);
                    selectableList._doSwapWith(undefined);
                });
            });
    }

    /**
     * UPDATE
     *
     * @param ev {Event}
     */
    onUpdate(ev) {
        ev.stopPropagation();
        const selectableList = ev.data;
        const rowDataId = selectableList.rowDataIdOf(this, true);
        const entity = selectableList.view.extractInputValuesByDataId(rowDataId, "showEdit");
        selectableList.repository.save(entity)
            .then(savedEntity => {
                selectableList.doWithState((crudListState) => {
                    // todo: sync "append" save param with view.notSelectedRow.tableRelativePositionOnCreate
                    crudListState.save(savedEntity, rowDataId);
                    // When not using repository resetSwappingState leaves the edited
                    // row in place otherwise would be deleted by swapping processing.
                    // crudListState.resetSwappingState();
                    selectableList._doSwapWith(undefined);
                });
            });
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @private
     */
    _configureEvents() {
        super._configureEvents();
        this.tableAdapter.$table
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='showDelete'],
                ${this.ownerSelector}[data-btn='showEdit']`, this, this.onShowDU)
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='showAdd']`, this, this.onShowAdd)
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='reload']`, this, this.onReload)
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='cancel']`, this, this.onCancel)
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='delete']`, this, this.onDelete)
            .on(this.withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='update']`, this, this.onUpdate);
    }
}