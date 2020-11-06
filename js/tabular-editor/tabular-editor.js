/**
 * Role: capture all table events
 */
class TabularEditor {
    constructor(tableId, readOnlyRowTmpl, editorRowTmpl) {
        this.context = new TabularEditorState();
        this.table = new HtmlTableAdapter(tableId);
        this.readOnlyRowTmpl = readOnlyRowTmpl;
        this.editorRowTmpl = editorRowTmpl;
        this.readOnlyRow = new RowView(this.context, this.table, this.readOnlyRowTmpl);
        this.editableRow = new RowView(this.context, this.table, this.editorRowTmpl);
        this.formUtils = new FormUtils("editorForm");
        this.repo = new PersonsRepository();
        this.configureTableEvents();
    }

    /**
     * row selection event handler
     */
    onItemSelection(ev) {
        ev.data.switchItemView(this.rowIndex - 1);
    }

    /**
     * header selection event handler
     */
    onHeadSelected(ev) {
        const tabularEditor = ev.data;
        if (tabularEditor.context.selectionExists() &&
            !tabularEditor.context.selectedIsPersistent()) {
            return false;
        }
        tabularEditor.createItem();
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
        console.log("onSave:\n", person);
        tabularEditor.repo.save(person)
            .then(() => {
                tabularEditor.context.items.splice(tabularEditor.context.selectedIndex, 1, person);
                tabularEditor.cancelEdit();
            })
            .catch((jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown);
                alert(textStatus);
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
        if (this.context.selectionExists()) {
            this.editableRow.switchTo(this.readOnlyRow);
        }
        this.context.items.splice(0, 0, {});
        this.context.selectedIndex = 0;
        this.editableRow.show();
    }

    /**
     * private method
     *
     * @returns true when the row was removed from table
     */
    cancelEdit() {
        const isPersisted = this.context.selectedIsPersistent();
        if (isPersisted) {
            this.editableRow.switchTo(this.readOnlyRow);
            this.context.selectedIndex = undefined;
        } else {
            this.readOnlyRow.hide();
            this.context.removeSelected();
        }
        return !isPersisted;
    }

    /**
     * private method
     */
    switchItemView(selectedIndex) {
        if (this.context.selectedIndex === selectedIndex) {
            return false;
        }
        const prevIdx = this.context.selectedIndex;
        const rowRemoved = this.context.selectionExists() && this.cancelEdit();
        this.context.selectedIndex = rowRemoved && prevIdx < selectedIndex ? selectedIndex - 1 : selectedIndex;
        this.readOnlyRow.switchTo(this.editableRow);
    }

    /**
     * private method
     */
    renderItems(persons) {
        console.log("persons:\n", persons);
        this.context.items = persons;
        this.context.items.forEach((_, i) => {
            this.context.selectedIndex = i;
            this.readOnlyRow.show();
        })
        this.context.selectedIndex = undefined;
    }

    /**
     * private method
     */
    configureTableEvents() {
        $(`#${this.table.tableId} thead`).on('dblclick', 'tr', this, this.onHeadSelected);
        this.table.tBody().on('dblclick', 'tr', this, this.onItemSelection);
        this.table.tBody().on('click', '#cancel', this, this.onCancel);
        this.table.tBody().on('click', '#save', this, this.onSave);
    }
}