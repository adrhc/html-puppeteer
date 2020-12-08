/**
 * Role: capture all table events (aka UI adapter)
 */
class TableEditorComponent {
    /**
     * @param editableTableView {TableEditorView}
     * @param tableElementAdapter {TableElementAdapter}
     * @param repository {TableEditorRepository}
     * @param rowEditorComponent {RowEditorComponent}
     */
    constructor(editableTableView, tableElementAdapter, repository, rowEditorComponent) {
        this.editableTableView = editableTableView;
        this.tableElementAdapter = tableElementAdapter;
        this.repository = repository;
        this.state = new TableEditorState();
        this.rowEditorComponent = rowEditorComponent;
        this._configureEvents();
    }

    /**
     * new-item-creation event handler
     */
    onNewRowCreation(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.createTransientSelection();
        editableTable.editableTableView.updateView(stateChangeResult);
        editableTable.rowEditorComponent.destroy();
        editableTable.rowEditorComponent.init(editableTable.state.selectedItem);
    }

    /**
     * (existing) item selection event handler
     */
    onSelectionSwitch(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        const rowDataId = editableTable.editableTableView.rowDataIdOf(this);
        const stateChanges = editableTable.state.switchSelectionTo(rowDataId);
        editableTable.editableTableView.updateView(stateChanges);
        editableTable.rowEditorComponent.destroy();
        editableTable.rowEditorComponent.init(editableTable.state.selectedItem);
    }

    /**
     * "cancel" (selection) event handler
     */
    onCancel(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        const stateChange = editableTable.state.cancelSelection();
        editableTable.rowEditorComponent.destroy();
        editableTable.editableTableView.updateView([stateChange]);
    }

    /**
     * "save" (selection) event handler
     */
    onSave(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        editableTable._catchRepoError(editableTable.saveEditedEntity())
            .then((savedItem) => {
                console.log("TableEditorComponent.onSave\n", savedItem);
                const stateChanges = editableTable.state.cancelSelectionAndUpdateItem(savedItem);
                editableTable.rowEditorComponent.destroy();
                editableTable.editableTableView.updateView(stateChanges);
            });
    }

    /**
     * component initializer
     */
    init() {
        this._catchRepoError(this.repository.getAll())
            .then((items) => {
                console.log("TableEditorComponent items:\n", items);
                this.state.items = items;
                this.editableTableView.init({items: items});
            });
    }

    /**
     * (internal) errors handler
     *
     * @param promise
     * @return {Promise<any>}
     * @private
     */
    _catchRepoError(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(textStatus);
        });
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        this._configureNewItemBtnEvent();
        this.tableElementAdapter.$tbody
            .on('dblclick', `tr[data-id!='${this.rowEditorComponent.buttonsRowDataId}']`, this, this.onSelectionSwitch)
            .on('click', "[name='cancelBtn']", this, this.onCancel)
            .on('click', "[name='saveBtn']", this, this.onSave);
    }

    _configureNewItemBtnEvent() {
        // dblclick on table header
        let $newItemBtn = this.tableElementAdapter.$table.find("[data-id='newItemBtn']");
        if ($newItemBtn.length) {
            $newItemBtn.on('dblclick', this, this.onNewRowCreation);
        }
        // click on newItemBtn button
        $newItemBtn = this.tableElementAdapter.$table.find("[name='newItemBtn']");
        if ($newItemBtn.length) {
            $newItemBtn.on('click', this, this.onNewRowCreation);
        }
    }

    get editedEntityValues() {
        if (!this.state.selectionExists()) {
            return undefined;
        }
        return this.rowEditorComponent.entityValuesFor(this.state.selectedId);
    }

    saveEditedEntity() {
        return this.repository.save(this.editedEntityValues);
    }
}