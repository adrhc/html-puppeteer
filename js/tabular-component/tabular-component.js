/**
 * Role: capture all table events
 */
class TabularComponent {
    constructor(tableId, bodyTmpl, readOnlyRowTmpl, editableRowTmpl) {
        this.state = new TabularState();
        this.table = new HtmlTableAdapter(tableId, bodyTmpl);
        this.readOnlyRowTmpl = readOnlyRowTmpl;
        this.editableRowTmpl = editableRowTmpl;
        this.readOnlyRow = new TabularRow(this.state, this.table, this.readOnlyRowTmpl);
        this.editableRow = new TabularEditableRow(this.state, this.table, this.editableRowTmpl);
        this.formUtils = new FormsHelper("editorForm");
        this.repo = new PersonsRepository();
        this.configureEvents();
    }

    /**
     * header selection event handler
     */
    onTHeadDblclick(ev) {
        const tabularEditor = ev.data;
        if (tabularEditor.state.notSavedItemExists()) {
            return false;
        }
        tabularEditor.createItem();
    }

    /**
     * row selection event handler
     */
    onRowDblclick(ev) {
        const tabularEditor = ev.data;
        const selectedIndex = this.rowIndex - 1;
        if (tabularEditor.state.isIndexSelected(selectedIndex)) {
            // index already selected, nothing else to do here
            return false;
        }
        tabularEditor.switchSelectionTo(selectedIndex);
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
                tabularEditor.state.replaceItem(savedPerson);
                tabularEditor.clearSelection();
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
        ev.data.clearSelection();
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
    createItem() {
        if (this.state.selectionExists()) {
            this.clearSelection();
        }
        this.state.createAndSelectEmptyItem(0);
        this.editableRow.show(true);
    }

    /**
     * private method
     */
    switchSelectionTo(selectedIndex) {
        const currentlySelectedIndex = this.state.selectedIndex;
        const prevSelItemWasRemoved = this.state.selectionExists() && this.clearSelection();
        const prevSelItemPositionIsBeforeNewSelection = currentlySelectedIndex < selectedIndex;
        const removedRowPositionedBeforeNewSelectionExists =
            prevSelItemWasRemoved && prevSelItemPositionIsBeforeNewSelection ? 1 : 0;
        this.state.selectedIndex = selectedIndex - removedRowPositionedBeforeNewSelectionExists;
        this.editableRow.show();
    }

    /**
     * private method
     *
     * @returns true when a row was removed from table but not replaced
     */
    clearSelection() {
        const selectionIsPersisted = this.state.selectionIsPersisted();
        if (selectionIsPersisted) {
            this.readOnlyRow.show();
            this.state.cancelSelection();
        } else {
            this.readOnlyRow.hide();
            this.state.removeSelectedItem();
        }
        return !selectionIsPersisted;
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