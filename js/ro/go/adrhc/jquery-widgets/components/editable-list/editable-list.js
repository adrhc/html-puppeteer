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
        editableList.switchTo(rowDataId, context);
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
        const context = $(this).data("btn");
        editableList.doWithState((editableListState) => {
            if (editableListState.findById(EntityUtils.prototype.transientId)) {
                // new item already exists, do nothing
                return;
            }
            // todo: correlate "append" createNewItem param with showAdd.tableRelativePositionOnCreate
            const newId = editableListState.createNewItem().id;
            editableListState.switchTo(newId, context);
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
        editableList.doWithState(editableListState => editableListState.switchToOff());
    }

    /**
     * DELETE
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
                    editableListState.switchToOff();
                    editableListState.removeById(rowDataId);
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
                    editableListState.switchToOff();
                    // todo: sync "append" save param with notSelectedRow.tableRelativePositionOnCreate
                    editableListState.save(savedEntity, rowDataId);
                }));
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