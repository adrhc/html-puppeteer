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
     *
     * @param ev {Event}
     */
    onNewItem(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.createTransientSelection();
        editableTable.editableTableView.updateView(stateChangeResult);
        editableTable.rowEditorComponent.destroy();
        editableTable.rowEditorComponent.init(editableTable.state.selectedItem);
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onSelectionSwitch(ev) {
        if ($(this).data("id") === "newItemBtn") {
            return false;
        }
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
     *
     * @param ev {Event}
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
     *
     * @param ev {Event}
     */
    onSave(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        editableTable._handleRepoError(editableTable._saveEditedEntity())
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
        this._handleRepoError(this.repository.getAll())
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
    _handleRepoError(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(textStatus);
        });
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @private
     */
    _configureEvents() {
        // use $tbody to not mix with onNewItem
        this.tableElementAdapter.$table
            .on('dblclick.table-editor', `tr[data-id!='${this.rowEditorComponent.buttonsRowDataId}']`, this, this.onSelectionSwitch)
            .on('click.table-editor', "[name='cancelBtn']", this, this.onCancel)
            .on('click.table-editor', "[name='saveBtn']", this, this.onSave)
            // dblclick on table header
            .on('dblclick.table-editor', "[data-id='newItemBtn']", this, this.onNewItem)
            // click on newItemBtn <button name='newItemBtn'>
            .on('click.table-editor', "[name='newItemBtn']", this, this.onNewItem);
    }

    /**
     * @return {undefined|*}
     * @private
     */
    get _editedEntityValues() {
        if (!this.state.selectionExists()) {
            return undefined;
        }
        return this.rowEditorComponent.entityValuesFor(this.state.selectedId);
    }

    /**
     * @return {Promise<IdentifiableEntity>}
     * @private
     */
    _saveEditedEntity() {
        return this.repository.save(this._editedEntityValues);
    }
}