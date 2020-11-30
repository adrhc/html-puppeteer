/**
 * Role: capture all table events
 */
class TabularComponent {
    constructor(tableId, bodyTmpl, readOnlyRowTmpl, editableRowTmpl, editorForm) {
        this.state = new TabularState();
        this.table = new HtmlTableAdapter(tableId, bodyTmpl);
        this.readOnlyRowTmpl = readOnlyRowTmpl;
        this.editableRowTmpl = editableRowTmpl;
        this.readOnlyRow = new TabularRow(this.table, this.readOnlyRowTmpl);
        this.editableRow = new TabularEditableRow(this.table, this.editableRowTmpl);
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
        tabularEditor.switchSelectionTo(stateChangeResult);
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
        tabularEditor.switchSelectionTo(stateChangeResult);
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
        tabularEditor.switchSelectionTo(stateChangeResult);
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
     */
    switchSelectionTo(stateChangeResult) {
        if (stateChangeResult.prevTabularItemState === stateChangeResult.newTabularItemState) {
            // selection not changed, do nothing
            return;
        }
        // removing row's previous view
        if (stateChangeResult.prevIsRemoved) {
            // previous selection is removed: remove the related row
            this.readOnlyRow.hide(stateChangeResult.prevTabularItemState);
        } else if (stateChangeResult.prevTabularItemState) {
            // previous selection exists: change it to read-only
            this.readOnlyRow.show(stateChangeResult.prevTabularItemState);
        }
        // displaying the row's new view
        if (!stateChangeResult.newTabularItemState) {
            // no row to display
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