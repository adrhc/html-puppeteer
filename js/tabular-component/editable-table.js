/**
 * Role: capture all table events
 */
class EditableTable {
    constructor(htmlTableAdapter, readOnlyRow, editableRow, buttonsRow, entityHelper) {
        this.htmlTableAdapter = htmlTableAdapter;
        this.readOnlyRow = readOnlyRow;
        this.editableRow = editableRow;
        this.buttonsRow = buttonsRow;
        this.entityHelper = entityHelper;
        this.state = new TableState();
        this.repo = new PersonsRepository();
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
        editableTable.repo.save(editableTable.entityHelper.extractEntity())
            .then((savedPerson) => {
                console.log(savedPerson);
                const stateChangeResult = editableTable.state.replaceItemForSelection(savedPerson);
                editableTable.updateView(stateChangeResult);
            })
            .catch((jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown);
                alert(textStatus);
            });
    }

    /**
     * initializer
     */
    initializeView() {
        this.repo.getAll()
            .then((persons) => {
                console.log("persons:\n", persons);
                this.state.items = persons;
                this.htmlTableAdapter.renderBody({persons: persons});
            })
            .catch((jqXHR, textStatus, errorThrown) => {
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

        // dropping previous view (aka DELETE_VIEW event type)
        if (stateChangeResult.prevIsRemoved) {
            // previous selection is removed: remove the related row
            this.readOnlyRow.hide(stateChangeResult.prevRowState);
            this.buttonsRow.hide();
        } else if (stateChangeResult.prevRowState) {
            // previous selection exists: change it to read-only
            this.readOnlyRow.show(stateChangeResult.prevRowState);
            this.buttonsRow.hide();
        }

        // "activating" the new view (aka UPDATE_VIEW event type)
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