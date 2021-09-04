goog.require('selectableList?.simpleListView?');

class EditableListComponent extends SelectableListComponent {
    static DELETE_ROW_TYPE = "delete";
    static ERROR_ROW_TYPE = "error";
    static ROW_TEMPLATE_INDEXES = {
        "delete": 3,
        "error": 4,
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

    /**
     * @return {SelectableListEntityExtractor}
     */
    get selectableListEntityExtractor() {
        return this.entityExtractor;
    }

    /**
     * @return {EditableListComponent}
     */
    constructor({config: {dontAutoInitialize, ...restOfConfig}, ...options}) {
        super(new EditableListOptions({...options, config: {dontAutoInitialize: true, ...restOfConfig}}));
        if (options.extractedEntityConverterFn) {
            this.selectableListEntityExtractor.entityConverterFn = options.extractedEntityConverterFn;
        }
        this.config.dontAutoInitialize = dontAutoInitialize ?? this.config.dontAutoInitialize;
        this._handleAutoInitialization();
    }

    _createEventsBinderConfigurer() {
        return new EditableListEventsBinder(this);
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
        const entityRow = stateChange.newStateOrPart;
        if (FailedEntity.isErrorItemId(entityRow?.entity?.id)) {
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

    reset() {
        super.reset();
        this._resetSwappingRowSelector();
    }

    /**
     * "showEdit" row component should be the same used for row
     * double-click in SelectableListComponent (i.e. undefined)
     *
     * @param {string|number} rowDataId
     * @param {string|number} context
     * @return {Promise<StateChange[]>}
     */
    showDU(rowDataId, context) {
        AssertionUtils.isTrue(["showEdit", "showDelete"].includes(context));
        return this.switchTo(rowDataId, context);
    }

    /**
     * @return {Promise<StateChange[]>}
     */
    showAdd() {
        const alreadyHasTransient = this.editableList.editableListState.hasTransient();
        if (alreadyHasTransient) {
            return Promise.reject();
        }
        return this.doWithState(() => {
            const editableListState = this.editableListState;
            const taggedStateChange = editableListState.createNewItem();
            editableListState.switchTo(taggedStateChange.newStateOrPart.entity.id, "showAdd");
        });
    }

    /**
     * @return {Promise<StateChange[]>}
     */
    cancel() {
        return this.doWithState(() => {
            this.editableListState.switchToOff();
        });
    }

    /**
     * @type {string|number} rowDataId
     * @return {Promise<StateChange[]|undefined>}
     */
    deleteRow(rowDataId) {
        return this._handleRepoErrors(this.repository.delete(rowDataId)
            .then(() =>
                this.doWithState(() => {
                    this.editableListState.switchToOff();
                    this.editableListState.removeById(rowDataId);
                })));
    }

    /**
     * @type {string|number} rowDataId
     * @return {Promise<StateChange[]|undefined>}
     */
    updateRow(rowDataId) {
        const entity = this.extractEntity();
        return this._handleRepoErrors(this.repository.save(entity)
            .then(savedEntity => this._handleUpdateSuccessful(savedEntity, rowDataId))
            // .then(savedEntity => editableList._handleUpdateError(
            //     new SimpleError("ERROR", undefined, savedEntity, ["problem1"]), rowDataId))
            .catch(simpleError => this._handleUpdateError(simpleError, rowDataId)));
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
            this.editableListState.createOrUpdate(savedEntity, previousItemId);
        });
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} failedItemId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @protected
     */
    _handleUpdateError(simpleError, failedItemId) {
        console.error(`${this.constructor.name}._handleUpdateError, savedEntity:\n${JSON.stringify(simpleError)}`);
        return this.doWithState(() => {
            this.editableListState.createErrorItem(simpleError, failedItemId);
        })
    }

    /**
     * @protected
     */
    _resetSwappingRowSelector() {
        Object.values(this.swappingRowSelector).forEach(row => row.reset())
    }
}