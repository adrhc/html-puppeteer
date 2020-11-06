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
    onRowSelected(ev) {
        const tabularEditor = ev.data;
        if (tabularEditor.context.selectedRow === this.rowIndex - 1) {
            return false;
        }
        if (tabularEditor.context.selectionExists()) {
            tabularEditor.editableRow.switchTo(tabularEditor.readOnlyRow);
        }
        tabularEditor.context.selectedRow = this.rowIndex - 1;
        tabularEditor.readOnlyRow.switchTo(tabularEditor.editableRow);
    }

    /**
     * @param ev
     */
    onHeadSelected(ev) {
        console.log("onHeadSelected");
        const tabularEditor = ev.data;
        tabularEditor.context.items.splice(0, 0, {});
        tabularEditor.context.selectedRow = 0;
        tabularEditor.editableRow.show();
    }

    onBtnCancel(ev) {
        const tabularEditor = ev.data;
        tabularEditor.editableRow.switchTo(tabularEditor.readOnlyRow);
        tabularEditor.context.selectedRow = undefined;
    }

    onBtnSave(ev) {
        const tabularEditor = ev.data;
        const person = tabularEditor.formUtils.objectifyForm();
        console.log("onBtnSave:\n", person);
        tabularEditor.repo.update(person)
            .then(() => alert("Saved!"))
            .catch((jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown);
                alert(textStatus);
            });
    }

    /**
     * initializer
     */
    render() {
        this.repo.get().then((persons) => {
            console.log("persons:\n", persons);
            this.context.items = persons;
            this.renderImpl();
        });
    }

    renderImpl() {
        this.context.items.forEach((_, i) => {
            this.context.selectedRow = i;
            this.readOnlyRow.show();
        })
        this.context.selectedRow = undefined;
    }

    /**
     * private method
     */
    configureTableEvents() {
        $(`#${this.table.tableId} thead`).on('dblclick', 'tr', this, this.onHeadSelected);
        // this.table.tBody().on('dblclick', 'tr', this, this.onRowSelected);
        this.table.tBody().on('click', '#cancel', this, this.onBtnCancel);
        this.table.tBody().on('click', '#save', this, this.onBtnSave);
    }
}