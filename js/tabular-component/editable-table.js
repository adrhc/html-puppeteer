/**
 * Role: capture all table events
 */
class EditableTable {
    constructor(tableId, bodyTmpl, readOnlyRowTmpl, editableRowTmpl, editorForm) {
        this.state = new TableState();
        this.table = new HtmlTableAdapter(tableId, bodyTmpl);
        this.readOnlyRowTmpl = readOnlyRowTmpl;
        this.editableRowTmpl = editableRowTmpl;
        this.readOnlyRow = new ReadOnlyRow(this.table, this.readOnlyRowTmpl);
        this.editableRow = new EditableRow(this.table, this.editableRowTmpl);
        this.formUtils = new FormsHelper(editorForm);
        this.repo = new PersonsRepository();
        this.configureEvents();
    }

    /**
     * header selection event handler
     */
    onTHeadDblclick(ev) {
        const tabularEditor = ev.data;
        if (tabularEditor.state.transientSelectionExists()) {
            // new empty row is already available for edit
            return false;
        }
        const stateChangeResult = tabularEditor.state.createEmptySelection(0);
        tabularEditor.refresh(stateChangeResult);
    }

    /**
     * row selection event handler
     */
    onRowDblclick(ev) {
        const tabularEditor = ev.data;
        const selectedIndex = this.rowIndex - 1;
        if (tabularEditor.state.isIndexSelected(selectedIndex)) {
            // index is already selected, nothing else to do here
            return false;
        }
        const stateChangeResult = tabularEditor.state.switchSelectionTo(selectedIndex);
        tabularEditor.refresh(stateChangeResult);
    }

    /**
     * save event handler
     */
    onBtnSave(ev) {
        const tabularEditor = ev.data;
        const person = tabularEditor.formUtils.objectifyForm();
        tabularEditor.repo.save(person)
            .then((savedPerson) => {
                console.log(savedPerson);
                const stateChangeResult = tabularEditor.state.replaceItemForSelection(savedPerson, true);
                tabularEditor.readOnlyRow.show(stateChangeResult.newTabularItemState);
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
        const tabularEditor = ev.data;
        const stateChangeResult = tabularEditor.state.cancelSelection();
        tabularEditor.refresh(stateChangeResult);
    }

    /**
     * initializer
     */
    show() {
        this.repo.getAll().then((persons) => {
            console.log("persons:\n", persons);
            this.state.items = persons;
            this.table.renderBody({persons: persons});
        });
    }

    /**
     * private method
     *
     * changes come in pairs: a row (previous) is hidden while another (new one) is shown (as editable)
     */
    refresh(stateChangeResult) {
        if (stateChangeResult.prevTabularItemState === stateChangeResult.newTabularItemState) {
            // selection not changed, do nothing
            return;
        }

        // dropping previous view
        if (stateChangeResult.prevIsRemoved) {
            // previous selection is removed: remove the related row
            this.readOnlyRow.hide(stateChangeResult.prevTabularItemState);
        } else if (stateChangeResult.prevTabularItemState) {
            // previous selection exists: change it to read-only
            this.readOnlyRow.show(stateChangeResult.prevTabularItemState);
        }

        // "activating" the new view
        if (!stateChangeResult.newTabularItemState) {
            // no row to display (aka there's no new view)
        } else if (stateChangeResult.newTabularItemState.selected) {
            // change row's view to editable
            this.editableRow.show(stateChangeResult.newTabularItemState, stateChangeResult.newIsCreated);
        } else {
            // change row's view to read-only
            this.readOnlyRow.show(stateChangeResult.newTabularItemState, stateChangeResult.newIsCreated);
        }
    }

    /**
     * private method
     */
    configureEvents() {
        $('#newItemBtn').on('dblclick', this, this.onTHeadDblclick);
        this.table.tbody()
            .on('dblclick', 'tr', this, this.onRowDblclick)
            .on('click', '#cancel', this, this.onBtnCancel)
            .on('click', '#save', this, this.onBtnSave);
    }
}