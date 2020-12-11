/**
 * Role: orchestrate state, view and sub-components
 *
 * API:
 * - "data-id" on rows is mandatory and optionally on header rows
 * - "data-id" = "newItemBtn" on a header row or a button with the name "newItemBtn" would trigger onNewItem
 */
class TableEditorComponent {
    /**
     * @param editableTableView {TableEditorView}
     * @param tableElementAdapter {TableElementAdapter}
     * @param repository {CrudRepository}
     * @param rowEditorComponent {RowEditorComponent}
     * @param state {TableEditorState}
     */
    constructor(editableTableView, tableElementAdapter, repository,
                rowEditorComponent, state = new TableEditorState()) {
        this.editableTableView = editableTableView;
        this.tableElementAdapter = tableElementAdapter;
        this.repository = repository;
        this.rowEditorComponent = rowEditorComponent;
        this.state = state;
    }

    /**
     * new-item-creation event handler
     *
     * @param ev {Event}
     */
    onNewItem(ev) {
        const editableTable = ev.data;
        editableTable._switchToEdit(editableTable.state.createTransientSelection());
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onSelectionSwitch(ev) {
        const editableTable = ev.data;
        if (!$(this).is("tr,td,th")) {
            return;
        }
        const isTr = $(this).is("tr");
        if (isTr && $(this).data("id") === "newItemBtn") {
            return;
        }
        const parentDataId = $(this).parent().data("id");
        if (!isTr && parentDataId === "newItemBtn") {
            return;
        }
        if (!!editableTable && parentDataId === editableTable.rowEditorComponent.buttonsRowDataId) {
            return;
        }
        ev.stopPropagation();
        const rowDataId = editableTable.editableTableView.rowDataIdOf(this);
        editableTable._switchToEdit(editableTable.state.switchSelectionTo(rowDataId));
    }

    /**
     * "cancel" (selection) event handler
     *
     * @param ev {Event}
     */
    onCancel(ev) {
        const editableTable = ev.data;
        const stateChange = editableTable.state.cancelSelection();
        editableTable._switchToReadOnly([stateChange]);
    }

    /**
     * "save" (selection) event handler
     *
     * @param ev {Event}
     */
    onSave(ev) {
        const editableTable = ev.data;
        editableTable._handleRepoError(editableTable._saveEditedEntity())
            .then((savedItem) => {
                console.log("TableEditorComponent.onSave\n", savedItem);
                editableTable.rowEditorComponent.rowEditorState.item = savedItem;
                const stateChanges = editableTable.state.cancelSelectionAndUpdateItem(savedItem);
                editableTable._switchToReadOnly(stateChanges);
            });
    }

    /**
     * @param stateChanges {Array<StateChange>}
     * @private
     */
    _switchToReadOnly(stateChanges) {
        this.rowEditorComponent.close();
        this.editableTableView.updateView(stateChanges);
    }

    /**
     * @param stateChanges {Promise<Array<StateChange>>}
     * @private
     */
    _switchToEdit(stateChanges) {
        stateChanges
            .then(it => {
                this.rowEditorComponent.close();
                return it;
            })
            .then(stateChanges => this.editableTableView.updateView(stateChanges))
            .then(() => {
                this.rowEditorComponent.init(this.state.selectedItem);
            });
    }

    /**
     * component initializer
     */
    init() {
        this._handleRepoError(this.repository.getAll())
            .then((items) => {
                console.log("TableEditorComponent items:\n", items);
                this.state.items = items;
                this.editableTableView.init(items);
            });
        this._configureEvents();
    }

    close() {
        this.tableElementAdapter.$table.off();
    }

    /**
     * (internal) errors handler
     *
     * @param promise
     * @return {Promise<any>}
     * @private
     */
    _handleRepoError(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(`${textStatus}\n${jqXHR.responseText}`);
            throw textStatus;
        });
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @private
     */
    _configureEvents() {
        // use $tbody to not mix with onNewItem
        this.tableElementAdapter.$table
            .on(this.eventsWithNamespace('dblclick'),
                `tr[data-owner='${this.owner}'][data-id!='newItemBtn']
                [data-id!='${this.rowEditorComponent.buttonsRowDataId}']`, this, this.onSelectionSwitch)
            .on(this.eventsWithNamespace('click'),
                `[data-owner='${this.owner}'][name='cancelBtn']`, this, this.onCancel)
            .on(this.eventsWithNamespace('click'), `[data-owner='${this.owner}'][name='saveBtn']`, this, this.onSave)
            // dblclick on table header
            .on(this.eventsWithNamespace('dblclick'), `tr[data-owner='${this.owner}'][data-id='newItemBtn']`, this, this.onNewItem)
            // click on newItemBtn <button name='newItemBtn'>
            .on(this.eventsWithNamespace('click'), `button[data-owner='${this.owner}'][name='newItemBtn']`, this, this.onNewItem);
    }

    eventsWithNamespace(events) {
        if ($.isArray(events)) {
            return events.map(ev => `${ev}.table-editor-${this.owner}`).join(" ");
        } else {
            return `${events}.table-editor-${this.owner}`;
        }
    }

    get owner() {
        return this.tableElementAdapter.tableId;
    }

    /**
     * @return {undefined|*}
     * @private
     */
    get _extractEntity() {
        if (!this.state.selectionExists()) {
            return undefined;
        }
        return this.rowEditorComponent.extractEntity();
    }

    /**
     * @return {Promise<IdentifiableEntity>}
     * @private
     */
    _saveEditedEntity() {
        return this.repository.save(this._extractEntity);
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractEntities(useOwnerOnFields) {
        return this.editableTableView.extractEntities(useOwnerOnFields);
    }
}