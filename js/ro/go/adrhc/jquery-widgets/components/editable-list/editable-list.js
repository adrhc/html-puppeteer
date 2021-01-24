class EditableListComponent extends SelectableListComponent {
    /**
     * @type {EditableListState}
     */
    editableListState;
    /**
     * @type {function(extractedEntity: IdentifiableEntity): IdentifiableEntity}
     */
    extractedEntityToRepoConverterFn;

    /**
     * @param repository {CrudRepository}
     * @param state {EditableListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     * @param extractedEntityToRepoConverterFn {function(extractedEntity: IdentifiableEntity): IdentifiableEntity}
     */
    constructor(repository, state, view,
                notSelectedRow, selectedRow,
                deletableRow,
                extractedEntityToRepoConverterFn = (extractedEntity) => extractedEntity) {
        super(repository, state, view, notSelectedRow, selectedRow);
        this.editableListState = state;
        this.swappingRowSelector["showAdd"] = selectedRow;
        this.swappingRowSelector["showEdit"] = selectedRow; // is equal to super.swappingRowSelector[false]
        this.swappingRowSelector["showDelete"] = deletableRow;
        this.extractedEntityToRepoConverterFn = extractedEntityToRepoConverterFn;
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
        const rowDataId = editableList.simpleListView.rowDataIdOf(this, true);
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
            if (editableListState.findById(EntityUtils.transientId)) {
                // new item already exists, do nothing
                return;
            }
            // todo: correlate "append" createNewItem param with showAdd.tableRelativePositionOnCreate
            // events: CREATE
            const newId = editableListState.createNewItem().id;
            // events: SWAP (isPrevious=true, if any previous exists) + SWAP (isPrevious=false)
            editableListState.switchTo(newId, context);
        });
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
        return editableList.doWithState(editableListState => editableListState.switchToOff());
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
        const rowDataId = editableList.simpleListView.rowDataIdOf(this, true);
        editableList._handleRepoErrors(editableList.repository.delete(rowDataId)
            .then(() =>
                editableList.doWithState((editableListState) => {
                    editableListState.switchToOff();
                    editableListState.removeById(rowDataId);
                })));
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
        const rowDataId = editableList.simpleListView.rowDataIdOf(this, true);
        let entity = editableList.extractEntity();
        entity = editableList.extractedEntityToRepoConverterFn(entity);
        editableList._handleRepoErrors(editableList.repository.save(entity)
            .then(savedEntity =>
                editableList.doWithState((editableListState) => {
                    // events: SWAP (isPrevious=true, if any previous exists) + DELETE (transient, if any)
                    editableListState.switchToOff();
                    // todo: sync "append" save param with notSelectedRow.tableRelativePositionOnCreate
                    // events: DELETE (transient, if any) + CREATE or just UPDATE
                    console.log(`${this.constructor.name}.onUpdate, savedEntity:\n${JSON.stringify(savedEntity)}`);
                    editableListState.save(savedEntity, rowDataId);
                }))
            .catch((simpleError) => {
                return editableList._selectedRowComponent.doWithState((editableListState) => {
                    editableListState.collectFromSimpleError(simpleError, "UPDATE_OR_CREATE", entity);
                });
            }));
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @protected
     */
    configureEvents() {
        super.configureEvents();
        this.simpleListView.$elem
            .on(this._appendNamespaceTo('click'),
                `${this._btnSelector(['showDelete', 'showEdit'])}`, this, this.onShowDU)
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='showAdd']`, this, this.onShowAdd)
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='cancel']`, this, this.onCancel)
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='delete']`, this, this.onDelete)
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='update']`, this, this.onUpdate);
    }

    reset() {
        super.reset();
        this._resetSwappingRowSelector();
    }

    /**
     * @protected
     */
    _resetSwappingRowSelector() {
        this.swappingRowSelector[true].reset();
        if (this.swappingRowSelector[false]) {
            this.swappingRowSelector[false].reset();
        }
        if (this.swappingRowSelector["showDelete"]) {
            this.swappingRowSelector["showDelete"].reset();
        }
    }
}