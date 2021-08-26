class EditableListComponent extends SelectableListComponent {
    static DELETE_ROW_TYPE = "delete";
    static ERROR_ROW_TYPE = "error";
    static ROW_TEMPLATE_INDEXES = {
        "delete": 3,
        "error": 4,
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
     * @return {EditableListState}
     */
    get editableListState() {
        return this.state;
    }

    get errorRow() {
        return this.swappingRowSelector["showError"];
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<TaggedStateChange[]>}
     */
    handleItemChange(stateChange) {
        console.log(`${this.constructor.name}.handleItemChange:\n${JSON.stringify(stateChange)}`);
        const entityRow = stateChange.stateOrPart;
        if (this.editableListState.isErrorItemId(entityRow?.entity?.id)) {
            return this.errorRow.update(entityRow);
        }
        return super.handleItemChange(stateChange);
    }

    /**
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _createErrorRow() {
        return this._identifiableRowComponentForType(EditableListComponent.ERROR_ROW_TYPE);
    }

    /**
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _createDeletableRow() {
        return this._identifiableRowComponentForType(EditableListComponent.DELETE_ROW_TYPE);
    }

    /**
     * @param {string} type
     * @return {number}
     * @protected
     */
    _rowTemplateIndexOf(type) {
        const index = EditableListComponent.ROW_TEMPLATE_INDEXES[type];
        return index != null ? index : super._rowTemplateIndexOf(type);
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
        swappingRowSelector["showDelete"] = options.deletableRow ?? this._createDeletableRow();
        swappingRowSelector["showError"] = options.errorRow ?? this._createErrorRow();
        return swappingRowSelector;
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

    shouldIgnoreOnSwitch(ev) {
        const selectableList = ev.data;
        const rowDataId = selectableList.simpleListView.rowDataIdOf(ev.currentTarget);
        return !selectableList.editableListState.isErrorItemId(rowDataId) ? super.shouldIgnoreOnSwitch(ev) : true;
    }

    /**
     * @param {IdentifiableEntity} savedEntity
     * @param {number|string} previousItemId
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
     * @param {number|string} rowDataId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @protected
     */
    _handleUpdateError(simpleError, rowDataId) {
        console.error(`${this.constructor.name}._handleUpdateError, savedEntity:\n${JSON.stringify(simpleError)}`);
        return this.doWithState((editableListState) => {
            editableListState.createErrorItem(simpleError, rowDataId);
        })
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     * @protected
     */
    handleItemOff(stateChange) {
        return this._removeErrorRow()
            .then(() => super.handleItemOff(stateChange));
    }

    _removeErrorRow() {
        const errorRowId = this.errorRow?.state.currentState?.entity.id;
        if (errorRowId == null) {
            return Promise.resolve();
        }
        this.errorRow.reset();
        return this.doWithState((editableListState) => {
            editableListState.removeById(errorRowId);
        });
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
            const row = this.swappingRowSelector[key];
            if (row) {
                row.reset();
            }
        }
    }
}