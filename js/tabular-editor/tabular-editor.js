/**
 * Role: capture all table events
 */
class TabularEditor {
    constructor(tableId, readOnlyRowTmpl, editorRowTmpl) {
        this.state = new TabularEditorState();
        this.table = new HtmlTableAdapter(tableId);
        this.readOnlyRowTmpl = readOnlyRowTmpl;
        this.editorRowTmpl = editorRowTmpl;
        this.readOnlyRow = new RowView(this.state, this.table, this.readOnlyRowTmpl);
        this.editableRow = new RowView(this.state, this.table, this.editorRowTmpl);
        this.formUtils = new FormUtils("editorForm");
        this.repo = new PersonsRepository();
        this.configureTableEvents();
    }

    /**
     * header selection event handler
     */
    onHeadSelection(ev) {
        const tabularEditor = ev.data;
        if (tabularEditor.state.notPersistentSelectionExists()) {
            return false;
        }
        tabularEditor.createItem();
    }

    /**
     * row selection event handler
     */
    onItemSelection(ev) {
        ev.data.switchSelectionTo(this.rowIndex - 1);
    }

    /**
     * cancel button
     */
    onCancel(ev) {
        ev.data.cancelEdit();
    }

    /**
     * save button
     */
    onSave(ev) {
        const tabularEditor = ev.data;
        const person = tabularEditor.formUtils.objectifyForm();
        tabularEditor.repo.save(person)
            .then(() => {
                tabularEditor.state.replaceItem(person);
                tabularEditor.cancelEdit();
            });
    }

    /**
     * initializer
     */
    show() {
        this.repo.get().then((persons) => {
            this.renderItems(persons);
        });
    }

    /**
     * private method
     */
    createItem() {
        if (this.state.selectionExists()) {
            this.cancelEdit();
        }
        this.state.createAndSelectEmptyItem(0);
        this.editableRow.show();
    }

    /**
     * private method
     */
    switchSelectionTo(selectedIndex) {
        if (this.state.isIndexSelected(selectedIndex)) {
            // index already selected, nothing else to do here
            return false;
        }
        const prevSelItemWasRemoved = this.state.selectionExists() && this.cancelEdit();
        const prevSelItemPositionIsBeforeNewSelection = this.state.selectedIndex < selectedIndex;
        const removedRowsPositionedBeforeNewSelectedOneExist = prevSelItemWasRemoved && prevSelItemPositionIsBeforeNewSelection ? 1 : 0;
        this.state.selectedIndex = selectedIndex - removedRowsPositionedBeforeNewSelectedOneExist;
        this.readOnlyRow.switchTo(this.editableRow);
    }

    /**
     * private method
     *
     * @returns true when a row was removed from table but not replaced
     */
    cancelEdit() {
        const selectionIsPersistent = this.state.selectionIsPersistent();
        if (selectionIsPersistent) {
            this.editableRow.switchTo(this.readOnlyRow);
            this.state.cancelSelection();
        } else {
            this.readOnlyRow.hide();
            this.state.removeSelectedItem();
        }
        return !selectionIsPersistent;
    }

    /**
     * private method
     */
    renderItems(persons) {
        console.log("persons:\n", persons);
        this.state.items = persons;
        this.state.items.forEach((_, i) => {
            this.state.selectedIndex = i;
            this.readOnlyRow.show();
        })
        this.state.cancelSelection();
    }

    /**
     * private method
     */
    configureTableEvents() {
        $(`#${this.table.tableId} thead`).on('dblclick', 'tr', this, this.onHeadSelection);
        this.table.tBody().on('dblclick', 'tr', this, this.onItemSelection);
        this.table.tBody().on('click', '#cancel', this, this.onCancel);
        this.table.tBody().on('click', '#save', this, this.onSave);
    }
}