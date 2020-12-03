/**
 * Role: capture all table events (aka UI adapter)
 */
class EditableTableComponent {
    constructor(editableTableView, htmlTableAdapter, entityHelper, repository) {
        this.editableTableView = editableTableView;
        this.htmlTableAdapter = htmlTableAdapter;
        this.entityHelper = entityHelper;
        this.repo = repository;
        this.state = new EditableTableState();
        this._configureEvents();
    }

    /**
     * new item creation event handler
     */
    onNewRowRequest(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.createTransientSelection();
        editableTable.editableTableView.updateView(stateChangeResult);
    }

    /**
     * item selection event handler
     */
    onRowSelection(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.switchSelectionTo(this.id);
        editableTable.editableTableView.updateView(stateChangeResult);
    }

    /**
     * cancel event handler
     */
    onCancel(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.cancelSelection();
        editableTable.editableTableView.updateView(stateChangeResult);
    }

    /**
     * save event handler
     */
    onSave(ev) {
        const editableTable = ev.data;
        const item = editableTable.entityHelper.extractEntity();
        editableTable._catchRepoError(editableTable.repo.save(item))
            .then((savedItem) => {
                console.log(savedItem);
                const stateChangeResult = editableTable.state.cancelSelectionAndUpdateItem(savedItem);
                editableTable.editableTableView.updateView(stateChangeResult);
            });
    }

    /**
     * initializer
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
     * handle repository errors
     */
    _catchRepoError(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(textStatus);
        });
    }

    _configureEvents() {
        $('#newItemBtn').on('dblclick', this, this.onNewRowRequest);
        this.htmlTableAdapter.$tbody()
            .on('dblclick', 'tr', this, this.onRowSelection)
            .on('click', '#cancelBtn', this, this.onCancel)
            .on('click', '#saveBtn', this, this.onSave);
    }
}