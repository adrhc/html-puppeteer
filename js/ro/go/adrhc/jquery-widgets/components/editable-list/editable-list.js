class EditableListComponent extends SelectableListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {EditableListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     */
    constructor(repository, state, view,
                notSelectedRow, selectedRow,
                deletableRow) {
        super(repository, state, view, notSelectedRow, selectedRow);
        this.swappingRowSelector["showAdd"] = selectedRow;
        this.swappingRowSelector["showEdit"] = selectedRow;
        this.swappingRowSelector["showDelete"] = deletableRow;
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
        selectableList.handleRepoErrors(selectableList.repository.delete(rowDataId))
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
        const entity = selectableList.extractSelectionEntity();
        selectableList.handleRepoErrors(selectableList.repository.save(entity))
            .then(savedEntity => {
                selectableList.doWithState((crudListState) => {
                    // todo: sync "append" save param with notSelectedRow.tableRelativePositionOnCreate
                    crudListState.save(savedEntity, rowDataId);
                    // When not using repository resetSwappingState leaves the edited
                    // row in place otherwise would be deleted by swapping processing.
                    // crudListState.resetSwappingState();
                    selectableList._doSwapWith(undefined);
                });
            });
    }

    /**
     * Updates the view on 1x "swapping" state change.
     *
     * At this moment the EditableListState.switchTo already delete the transient entity such
     * that super.updateSwappingComponent find no entity when calling reloadItemOnSwapping.
     *
     * @param swappingStateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateSwappingComponent(swappingStateChange) {
        return super.updateSwappingComponent(swappingStateChange)
            .then(swappingStateChange => this._removeSwappingOffRow(swappingStateChange));
    }

    /**
     * @param swappingStateChange {StateChange|undefined}
     * @private
     */
    _removeSwappingOffRow(swappingStateChange) {
        const swappingDetails = swappingStateChange.data;
        const selectableSwappingData = swappingDetails.data;
        if (swappingDetails.isPrevious) {
            const id = selectableSwappingData.reloadedId ? selectableSwappingData.reloadedId : selectableSwappingData.item.id;
            console.log(`removing row on swapping off: id = ${id}`);
            this.tableAdapter.$getOwnRowByData("remove-on-swapping-off", id).remove();
        }
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