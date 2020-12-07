/**
 * Role: capture all table events (aka UI adapter)
 */
class TableEditorComponent {
    /**
     * @param editableTableView {TableEditorView}
     * @param tableElementAdapter {TableElementAdapter}
     * @param repository {TableEditorRepository}
     */
    constructor(editableTableView, tableElementAdapter, repository) {
        this.editableTableView = editableTableView;
        this.tableElementAdapter = tableElementAdapter;
        this.repository = repository;
        this.state = new TableEditorState();
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
    }

    /**
     * (existing) item selection event handler
     */
    onSelectionSwitch(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        const rowDataId = editableTable.editableTableView.rowDataIdOf(this);
        const stateChangeResult = editableTable.state.switchSelectionTo(rowDataId);
        editableTable.editableTableView.updateView(stateChangeResult);
    }

    /**
     * "cancel" (selection) event handler
     */
    onCancel(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        const stateChange = editableTable.state.cancelSelection();
        editableTable.editableTableView.updateView([stateChange]);
    }

    /**
     * "save" (selection) event handler
     */
    onSave(ev) {
        ev.stopPropagation();
        const editableTable = ev.data;
        const item = editableTable.editableTableView.entityValuesFor(editableTable.state.selectedId);
        editableTable._catchRepoError(editableTable.repository.save(item))
            .then((savedItem) => {
                console.log(savedItem);
                const stateChanges = editableTable.state.cancelSelectionAndUpdateItem(savedItem);
                editableTable.editableTableView.updateView(stateChanges);
            });
    }

    /**
     * component initializer
     */
    init() {
        this._catchRepoError(this.repository.getAll())
            .then((items) => {
                console.log("items:\n", items);
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
            .on('dblclick', `tr[data-id!='${this._buttonsRowDataId}']`, this, this.onSelectionSwitch)
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

    get _buttonsRowDataId() {
        return this.editableTableView.buttonsRow.buttonsRowDataId;
    }
}