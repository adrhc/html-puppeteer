class EditableListComponent extends SelectableListComponent {
    /**
     * @type {EditableListState}
     */
    editableListState;

    /**
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param view {SimpleListView}
     * @param offRow {IdentifiableRowComponent}
     * @param onRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     * @param [extractedEntityConverterFn] {function(extractedEntity: {}): IdentifiableEntity}
     * @param {ComponentConfiguration} [config]
     */
    constructor(repository, state, view,
                offRow, onRow,
                deletableRow,
                extractedEntityConverterFn, config) {
        super(repository, state, view, offRow, onRow, config);
        this.editableListState = state;
        this.swappingRowSelector["showAdd"] = onRow;
        this.swappingRowSelector["showEdit"] = onRow; // is equal to super.swappingRowSelector[false]
        this.swappingRowSelector["showDelete"] = deletableRow;
        if (extractedEntityConverterFn) {
            this.selectableListEntityExtractor.entityConverterFn = extractedEntityConverterFn;
        }
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
        const alreadyHasTransient = editableList.editableListState.hasTransient();
        if (alreadyHasTransient) {
            return Promise.reject();
        }
        return editableList.doWithState((state) => {
            const editableListState = editableList.castState(state);
            const taggedStateChange = editableListState.createNewItem();
            editableListState.switchTo(taggedStateChange.stateOrPart.entity.id, "showAdd");
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
        return editableList.doWithState(state => {
            const editableListState = editableList.castState(state);
            editableListState.switchToOff();
        });
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
                editableList.doWithState((state) => {
                    const editableListState = editableList.castState(state);
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
        editableList._handleRepoErrors(editableList.repository.save(entity)
            .then(savedEntity =>
                editableList.doWithState((state) => {
                    const editableListState = editableList.castState(state);
                    // events: SWAP (isPrevious=true, if any previous exists) + DELETE (transient, if any)
                    editableListState.switchToOff();
                    // todo: sync "append" save param with offRow.tableRelativePositionOnCreate
                    // events: DELETE (transient, if any) + CREATE or just UPDATE
                    console.log(`${this.constructor.name}.onUpdate, savedEntity:\n${JSON.stringify(savedEntity)}`);
                    editableListState.save(savedEntity, rowDataId);
                }))
            .catch((simpleError) => {
                return editableList.selectedRowComponent.doWithState((state) => {
                    state.collectFromSimpleError(simpleError, "UPDATE_OR_CREATE", entity);
                });
            }));
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @protected
     */
    _configureEvents() {
        super._configureEvents();
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
        for (let key in this.swappingRowSelector) {
            this.swappingRowSelector[key].reset();
        }
    }

    /**
     * @param {StateHolder} state
     * @return {EditableListState}
     */
    castState(state) {
        return state;
    }
}