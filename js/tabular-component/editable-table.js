/**
 * Role: capture all table events
 */
class EditableTable {
    constructor(htmlTableAdapter, readOnlyRow, editableRow, entityHelper) {
        this.htmlTableAdapter = htmlTableAdapter;
        this.readOnlyRow = readOnlyRow;
        this.editableRow = editableRow;
        this.entityHelper = entityHelper;
        this.state = new TableState();
        this.repo = new PersonsRepository();
        this.configureEvents();
    }

    /**
     * header selection event handler
     */
    onTHeadDblclick(ev) {
        const editableTable = ev.data;
        if (editableTable.state.transientSelectionExists()) {
            // new empty row is already available for edit
            return false;
        }
        const stateChangeResult = editableTable.state.createTransientSelection();
        editableTable.update(stateChangeResult);
    }

    /**
     * row selection event handler
     */
    onRowDblclick(ev) {
        const editableTable = ev.data;
        const selectedId = this.id;
        if (editableTable.state.isIdSelected(selectedId)) {
            // index is already selected, nothing else to do here
            return false;
        }
        const stateChangeResult = editableTable.state.switchSelectionTo(selectedId);
        editableTable.update(stateChangeResult);
    }

    /**
     * save event handler
     */
    onBtnSave(ev) {
        const editableTable = ev.data;
        const person = editableTable.entityHelper.extractEntity();
        editableTable.repo.save(person)
            .then((savedPerson) => {
                console.log(savedPerson);
                const stateChangeResult = editableTable.state.replaceItemForSelection(savedPerson, true);
                editableTable.readOnlyRow.show(stateChangeResult.newRowState);
            })
            .catch((jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown);
                alert(textStatus);
            });
    }

    /**
     * cancel event handler
     */
    onBtnCancel(ev) {
        const editableTable = ev.data;
        const stateChangeResult = editableTable.state.cancelSelection();
        editableTable.update(stateChangeResult);
    }

    /**
     * initializer
     */
    show() {
        this.repo.getAll().then((persons) => {
            console.log("persons:\n", persons);
            this.state.items = persons;
            this.htmlTableAdapter.renderBody({persons: persons});
        });
    }

    /**
     * private method
     *
     * changes come in pairs: a row (previous) is hidden while another (new one) is shown (as editable)
     */
    update(stateChangeResult) {
        if (stateChangeResult.prevRowState === stateChangeResult.newRowState) {
            // selection not changed, do nothing
            return;
        }

        // dropping previous view
        if (stateChangeResult.prevIsRemoved) {
            // previous selection is removed: remove the related row
            this.readOnlyRow.hide(stateChangeResult.prevRowState);
        } else if (stateChangeResult.prevRowState) {
            // previous selection exists: change it to read-only
            this.readOnlyRow.show(stateChangeResult.prevRowState);
        }

        // "activating" the new view
        if (!stateChangeResult.newRowState) {
            // no row to display (aka there's no new view)
        } else if (stateChangeResult.newRowState.selected) {
            // change row's view to editable
            this.editableRow.show(stateChangeResult.newRowState, stateChangeResult.newIsCreated);
        } else {
            // change row's view to read-only
            this.readOnlyRow.show(stateChangeResult.newRowState, stateChangeResult.newIsCreated);
        }
    }

    /**
     * private method
     */
    configureEvents() {
        $('#newItemBtn').on('dblclick', this, this.onTHeadDblclick);
        this.htmlTableAdapter.$tbody()
            .on('dblclick', 'tr', this, this.onRowDblclick)
            .on('click', '#cancel', this, this.onBtnCancel)
            .on('click', '#save', this, this.onBtnSave);
    }
}