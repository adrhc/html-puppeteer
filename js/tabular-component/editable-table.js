/**
 * Role: capture all table events (aka UI adapter)
 */
class EditableTable {
    constructor(htmlTableAdapter, readOnlyRow, editableRow, buttonsRow, entityHelper, repository) {
        this.htmlTableAdapter = htmlTableAdapter;
        this.readOnlyRow = readOnlyRow;
        this.editableRow = editableRow;
        this.buttonsRow = buttonsRow;
        this.entityHelper = entityHelper;
        this.state = new TableState();
        this.repo = repository;
        this.configureEvents();
    }

    /**
     * new item creation event handler
     */
    onNewRowRequest(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.createTransientSelection();
        editableTable.updateView(stateChangeResult);
    }

    /**
     * item selection event handler
     */
    onRowSelection(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.switchSelectionTo(this.id);
        editableTable.updateView(stateChangeResult);
    }

    /**
     * cancel event handler
     */
    onCancel(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.cancelSelection();
        editableTable.updateView(stateChangeResult);
    }

    /**
     * save event handler
     */
    onSave(ev) {
        const editableTable = ev.data;
        const item = editableTable.entityHelper.extractEntity();
        editableTable.catchRepoError(editableTable.repo.save(item))
            .then((savedItem) => {
                console.log(savedItem);
                const stateChangeResult = editableTable.state.replaceItemForSelection(savedItem);
                editableTable.updateView(stateChangeResult);
            });
    }

    /**
     * initializer
     */
    init() {
        this.catchRepoError(this.repo.getAll())
            .then((items) => {
                console.log("items:\n", items);
                this.state.items = items;
                this.htmlTableAdapter.renderBody({items: items});
            });
    }

    catchRepoError(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(textStatus);
        });
    }

    /**
     * private method
     *
     * changes come in pairs: a row (previous) is hidden while another (new one) is shown (as editable)
     */
    updateView(stateChangeResult) {
        if (!stateChangeResult) {
            // selection not changed, do nothing
            return;
        }

        // dropping previous view (aka STATE_DELETED event type)
        if (stateChangeResult.prevIsRemoved) {
            // previous selection is removed: remove the related row
            this.buttonsRow.hide();
            this.readOnlyRow.hide(stateChangeResult.prevRowState);
        } else if (stateChangeResult.prevRowState) {
            // previous selection exists: change it to read-only
            this.buttonsRow.hide();
            this.readOnlyRow.show(stateChangeResult.prevRowState);
        }

        // "activating" the new view (aka STATE_CREATED event type)
        if (!stateChangeResult.newRowState) {
            // no row to display (aka there's no new view)
        } else if (stateChangeResult.newRowState.selected) {
            // change row's view to editable
            this.editableRow.show(stateChangeResult.newRowState, stateChangeResult.newIsCreated);
            this.buttonsRow.show(stateChangeResult.newRowState)
        } else {
            // change row's view to read-only
            this.readOnlyRow.show(stateChangeResult.newRowState, stateChangeResult.newIsCreated);
        }
    }

    /**
     * private method
     */
    configureEvents() {
        $('#newItemBtn').on('dblclick', this, this.onNewRowRequest);
        this.htmlTableAdapter.$tbody()
            .on('dblclick', 'tr', this, this.onRowSelection)
            .on('click', '#cancelBtn', this, this.onCancel)
            .on('click', '#saveBtn', this, this.onSave);
    }
}