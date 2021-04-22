class EditableListComponent extends SelectableListComponent {
    static DELETE_ROW_TYPE = "delete";
    static ERROR_ROW_TYPE = "error";
    /**
     * @type {IdentifiableRowComponent}
     */
    errorRow;

    /**
     * @param {EditableListOptions=} options
     */
    constructor(options = new EditableListOptions()) {
        super(_.defaults(new EditableListOptions(), {forceDontAutoInitialize: true}, options));
        if (options.extractedEntityConverterFn) {
            this.selectableListEntityExtractor.entityConverterFn = options.extractedEntityConverterFn;
        }
        return this._handleAutoInitialization();
    }

    _setupSwappingRowSelectorOf(options) {
        super._setupSwappingRowSelectorOf(options);
        this.swappingRowSelector["showAdd"] = this.onRow;
        this.swappingRowSelector["showEdit"] = this.onRow; // is equal to super.swappingRowSelector[false]
        const mustacheTableElemAdapter = this.simpleListView.mustacheTableElemAdapter;
        this.swappingRowSelector["showDelete"] = EditableListComponent.$deletableRowTmpl(mustacheTableElemAdapter, this.config);
        this.errorRow = EditableListComponent.$errorRowTmpl(mustacheTableElemAdapter, this.config);
    }

    static $errorRowTmpl(mustacheTableElemAdapter, config) {
        return SelectableListComponent._$rowTmplOf(
            SelectableListComponent.ERROR_ROW_TYPE, mustacheTableElemAdapter, config);
    }

    static $deletableRowTmpl(mustacheTableElemAdapter, config) {
        return SelectableListComponent._$rowTmplOf(
            SelectableListComponent.DELETE_ROW_TYPE, mustacheTableElemAdapter, config);
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
            .catch(simpleError => editableList._handleUpdateError(simpleError, rowDataId)));
    }

    /**
     * @param {IdentifiableEntity} savedEntity
     * @param {number|string} rowDataId
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _handleUpdateSuccessful(savedEntity, rowDataId) {
        console.log(`${this.constructor.name}._handleUpdateSuccessful, savedEntity:\n${JSON.stringify(savedEntity)}`);
        return this.doWithState(() => {
            this.editableListState.switchToOff();
            this.editableListState.save(savedEntity, rowDataId);
        });
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} rowDataId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @protected
     */
    _handleUpdateError(simpleError, rowDataId) {
        console.log(`${this.constructor.name}._handleUpdateError, savedEntity:\n${JSON.stringify(simpleError)}`);
        const errorRow = this.editableListState.createErrorItem(simpleError, rowDataId);
        return this.errorRow.update(errorRow);
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     * @protected
     */
    handleItemOff(stateChange) {
        const errorRowId = this.errorRow.state.currentState?.id;
        if (errorRowId == null) {
            return super.handleItemOff(stateChange);
        }
        this.errorRow.reset();
        return this.doWithState(() => {
            this.editableListState.removeById(errorRowId);
        }).then(() => super.handleItemOff(stateChange));
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

    /**
     * @return {EditableListState}
     */
    get editableListState() {
        return this.state;
    }

    get onRow() {
        return this.swappingRowSelector[SwitchType.ON];
    }
}