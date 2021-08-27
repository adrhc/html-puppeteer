class EditableListComponent extends SelectableListComponent {
    static DELETE_ROW_TYPE = "delete";
    static ERROR_ROW_TYPE = "error";
    static ROW_TEMPLATE_INDEXES = {
        "delete": 3,
        "error": 4,
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

    /**
     * @param {EditableListOptions} options
     * @return {{}}
     * @protected
     */
    _createSwappingRowSelector(options) {
        const swappingRowSelector = super._createSwappingRowSelector(options);
        const onRow = swappingRowSelector[SwitchType.ON];
        swappingRowSelector["showAdd"] = onRow;
        swappingRowSelector["showEdit"] = onRow;
        swappingRowSelector["showDelete"] = options.deletableRow ?? this
            ._identifiableRowComponentForType(EditableListComponent.DELETE_ROW_TYPE);
        swappingRowSelector["showError"] = options.errorRow ?? this
            ._identifiableRowComponentForType(EditableListComponent.ERROR_ROW_TYPE);
        return swappingRowSelector;
    }

    /**
     * @param {string} type
     * @return {number}
     * @protected
     */
    _rowTemplateIndexOf(type) {
        return EditableListComponent.ROW_TEMPLATE_INDEXES[type] ?? super._rowTemplateIndexOf(type);
    }

    /**
     * @param {TaggedStateChange<EntityRow>} stateChange
     * @return {Promise<TaggedStateChange<EntityRow>[]>}
     */
    handleItemChange(stateChange) {
        console.log(`${this.constructor.name}.handleItemChange:\n${JSON.stringify(stateChange)}`);
        const entityRow = stateChange.stateOrPart;
        if (ErrorEntity.isErrorItemId(entityRow?.entity?.id)) {
            // ignoring any previous state held by errorRow
            return this.errorRow.processStateChanges(
                new CreateStateChange(entityRow, stateChange.partName));
        }
        return super.handleItemChange(stateChange);
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     * @protected
     */
    handleItemOff(stateChange) {
        return this.doWithState(() => {
            this.editableListState.removeErrorItems();
        }).then(() => super.handleItemOff(stateChange));
    }

    shouldIgnoreOnSwitch(ev) {
        const selectableList = ev.data;
        const rowDataId = selectableList.simpleListView.rowDataIdOf(ev.currentTarget);
        return ErrorEntity.isErrorItemId(rowDataId) || super.shouldIgnoreOnSwitch(ev);
    }

    reset() {
        super.reset();
        this._resetSwappingRowSelector();
    }

    /**
     * @param {EditableListOptions=} options
     */
    constructor(options = new EditableListOptions()) {
        super(EditableListOptions.of(options, true));
        if (options.extractedEntityConverterFn) {
            this.selectableListEntityExtractor.entityConverterFn = options.extractedEntityConverterFn;
        }
        return this._handleAutoInitialization();
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
        if (rowDataId == null || rowDataId === "" || context == null || context === "") {
            return;
        }
        ev.stopPropagation();
        // "showEdit" row component should be the same used for row double-click in SelectableListComponent (i.e. undefined)
        // context could be "showEdit" or "showDelete"
        return editableList.switchTo(rowDataId, context);
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
        return editableList.doWithState(() => {
            const editableListState = editableList.editableListState;
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
        return editableList.doWithState(() => {
            editableList.editableListState.switchToOff();
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
        return editableList._handleRepoErrors(editableList.repository.delete(rowDataId)
            .then(() =>
                editableList.doWithState(() => {
                    editableList.editableListState.switchToOff();
                    editableList.editableListState.removeById(rowDataId);
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
        const entity = editableList.extractEntity();
        return editableList._handleRepoErrors(editableList.repository.save(entity)
            .then(savedEntity => editableList._handleUpdateSuccessful(savedEntity, rowDataId))
            // .then(savedEntity => editableList._handleUpdateError(
            //     new SimpleError("ERROR", undefined, savedEntity, ["problem1"]), rowDataId))
            .catch(simpleError => editableList._handleUpdateError(simpleError, rowDataId)));
    }

    /**
     * @param {IdentifiableEntity} savedEntity
     * @param {number|string} previousItemId the item's id before persisting
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _handleUpdateSuccessful(savedEntity, previousItemId) {
        console.log(`${this.constructor.name}._handleUpdateSuccessful, savedEntity:\n${JSON.stringify(savedEntity)}`);
        return this.doWithState(() => {
            this.editableListState.switchToOff();
            this.editableListState.createOrUpdate(savedEntity, {previousItemId});
        });
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} failedId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @protected
     */
    _handleUpdateError(simpleError, failedId) {
        console.error(`${this.constructor.name}._handleUpdateError, savedEntity:\n${JSON.stringify(simpleError)}`);
        return this.doWithState(() => {
            this.editableListState.createErrorItem(simpleError, failedId);
        })
    }

    /**
     * @protected
     */
    _resetSwappingRowSelector() {
        Object.values(this.swappingRowSelector).forEach(row => row.reset())
    }

    /**
     * @return {EditableListState}
     */
    get editableListState() {
        return this.state;
    }

    /**
     * @return {IdentifiableRowComponent}
     */
    get errorRow() {
        return this.swappingRowSelector["showError"];
    }
}