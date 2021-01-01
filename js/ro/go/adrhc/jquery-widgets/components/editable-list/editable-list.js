class EditableListComponent extends SelectableListComponent {
    /**
     * @type {EditableListState}
     */
    editableListState;

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
        this.editableListState = state;
        this.swappingRowSelector["showAdd"] = selectedRow;
        this.swappingRowSelector["showEdit"] = selectedRow; // is equal to super.swappingRowSelector[false]
        this.swappingRowSelector["showDelete"] = deletableRow;
    }

    /**
     * SHOW DELETE OR UPDATE (aka EDIT)
     *
     * @param ev {Event}
     */
    onShowDU(ev) {
        /**
         * @type {EditableListComponent}
         */
        const editableList = ev.data;
        const rowDataId = editableList.rowDataIdOf(this, true);
        const context = $(this).data("btn");
        if (!rowDataId || !context) {
            return;
        }
        ev.stopPropagation();
        // "showEdit" row component should be the same used for row double-click in SelectableListComponent (i.e. undefined)
        // context could be "showEdit" or "showDelete"
        editableList._doSwapWith(rowDataId, context);
    }

    /**
     * SHOW ADD
     *
     * @param ev
     */
    onShowAdd(ev) {
        ev.stopPropagation();
        /**
         * @type {EditableListComponent}
         */
        const editableList = ev.data;
        editableList.doWithState((editableListState) => {
            // todo: correlate "append" createNewItem param with showAdd.tableRelativePositionOnCreate
            const newId = editableListState.createNewItem().id;
            editableListState.switchTo(newId, "showAdd");
        });
    }

    /**
     * RELOAD
     *
     * @param ev {Event}
     */
    onReload(ev) {
        ev.stopPropagation();
        /**
         * @type {EditableListComponent}
         */
        const editableList = ev.data;
        editableList.reloadState().then(() => editableList.updateViewOnStateChanges());
    }

    reloadState() {
        return super.reloadState().then(() => this.editableListState.resetSwappingState())
    }

    /**
     * CANCEL
     *
     * @param ev {Event}
     */
    onCancel(ev) {
        ev.stopPropagation();
        /**
         * @type {EditableListComponent}
         */
        const editableList = ev.data;
        editableList._doSwapWith(undefined);
    }

    /**
     * UPDATE
     *
     * @param ev {Event}
     */
    onDelete(ev) {
        ev.stopPropagation();
        /**
         * @type {EditableListComponent}
         */
        const editableList = ev.data;
        const rowDataId = editableList.rowDataIdOf(this, true);
        editableList._handleRepoErrors(editableList.repository.delete(rowDataId))
            .then(() =>
                editableList.doWithState((editableListState) => {
                    editableListState.removeById(rowDataId);
                    editableListState.switchTo(undefined);
                }));
    }

    /**
     * UPDATE
     *
     * @param ev {Event}
     */
    onUpdate(ev) {
        ev.stopPropagation();
        /**
         * @type {EditableListComponent}
         */
        const editableList = ev.data;
        const rowDataId = editableList.rowDataIdOf(this, true);
        const entity = editableList.extractSelectionEntity();
        editableList._handleRepoErrors(editableList.repository.save(entity))
            .then(savedEntity =>
                editableList.doWithState((editableListState) => {
                    // todo: sync "append" save param with notSelectedRow.tableRelativePositionOnCreate
                    editableListState.save(savedEntity, rowDataId);
                    // When not using repository resetSwappingState leaves the edited
                    // row in place otherwise would be deleted by swapping processing.
                    // crudListState.resetSwappingState();
                    editableListState.switchTo(undefined);
                }));
    }

    /**
     * At this moment the EditableListState.switchTo already delete the transient entity such
     * that super.updateViewOnSWAP find no entity when calling reloadItemOnSwapping.
     *
     * @param swappingStateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnSWAP(swappingStateChange) {
        return super.updateViewOnSWAP(swappingStateChange)
            .then(swappingStateChange => {
                this._removeSwappingOffRows(swappingStateChange);
                return swappingStateChange;
            });
    }

    /**
     * @param swappingStateChange {StateChange|undefined}
     * @private
     */
    _removeSwappingOffRows(swappingStateChange) {
        /**
         * @type {SwappingDetails}
         */
        const swappingDetails = swappingStateChange.data;
        const selectableSwappingData = swappingDetails.data;
        // itemId could be undefined when previously switched to undefined (to switch off the previous)
        const itemId = selectableSwappingData.reloadedId ? selectableSwappingData.reloadedId : selectableSwappingData.itemId;
        if (swappingDetails.isPrevious && !!itemId) {
            console.log(`removing row on swapping off: id = ${itemId}`);
            this.tableAdapter.$getOwnedRowByData("remove-on-swapping-off", itemId).remove();
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
            .on(this._withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='showDelete'],
                ${this.ownerSelector}[data-btn='showEdit']`, this, this.onShowDU)
            .on(this._withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='showAdd']`, this, this.onShowAdd)
            .on(this._withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='reload']`, this, this.onReload)
            .on(this._withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='cancel']`, this, this.onCancel)
            .on(this._withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='delete']`, this, this.onDelete)
            .on(this._withNamespaceFor('click'),
                `${this.ownerSelector}[data-btn='update']`, this, this.onUpdate);
    }
}