/**
 * Role: capture all table events (aka UI adapter)
 */
class TableEditorComponent {
    constructor(editableTableView, htmlTableAdapter, entityHelper, repository) {
        this.editableTableView = editableTableView;
        this.htmlTableAdapter = htmlTableAdapter;
        this.entityHelper = entityHelper;
        this.repo = repository;
        this.state = new TableEditorState();
        this._configureEvents();
    }

    /**
     * new-item-creation event handler
     */
    onNewRowCreation(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.createTransientSelection();
        editableTable.editableTableView.updateView(stateChangeResult);
    }

    /**
     * (existing) item selection event handler
     */
    onSelectionSwitch(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.switchSelectionTo(this.id);
        editableTable.editableTableView.updateView(stateChangeResult);
    }

    /**
     * "cancel" (selection) event handler
     */
    onCancel(ev) {
        const editableTable = ev.data;
        const stateChange = editableTable.state.cancelSelection();
        editableTable.editableTableView.updateView([stateChange]);
    }

    /**
     * "save" (selection) event handler
     */
    onSave(ev) {
        const editableTable = ev.data;
        const item = editableTable.entityHelper.extractEntity();
        editableTable._catchRepoError(editableTable.repo.save(item))
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
        this._catchRepoError(this.repo.getAll())
            .then((items) => {
                console.log("items:\n", items);
                this.state.items = items;
                this.editableTableView.init({items: items});
            });
    }

    /**
     * (internal) errors handler
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
        $('#newItemBtn').on('dblclick', this, this.onNewRowCreation);
        this.htmlTableAdapter.$tbody()
            .on('dblclick', 'tr', this, this.onSelectionSwitch)
            .on('click', '#cancelBtn', this, this.onCancel)
            .on('click', '#saveBtn', this, this.onSave);
    }
}