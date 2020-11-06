/**
 * Role: capture all table events
 */
class TabularEditor {
    constructor(items, tableId, readOnlyRowTmpl, editorRowTmpl) {
        this.context = new TabularEditorState(items);
        this.table = new HtmlTableAdapter(tableId);
        this.readOnlyRowTmpl = readOnlyRowTmpl;
        this.editorRowTmpl = editorRowTmpl;
        this.readOnlyRow = new RowView(this.context, this.table, this.readOnlyRowTmpl);
        this.editableRow = new RowView(this.context, this.table, this.editorRowTmpl);
        this.formUtils = new FormUtils("editorForm");
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

    onBtnCancel(ev) {
        const tabularEditor = ev.data;
        console.log("onBtnCancel:\n", tabularEditor.formUtils.objectifyForm());
    }

    onBtnSave(ev) {
        const tabularEditor = ev.data;
        console.log("onBtnSave:\n", tabularEditor.formUtils.objectifyForm());
    }

    /**
     * initializer
     */
    render() {
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
        this.table.tBody().on('dblclick', 'tr', this, this.onRowSelected);
        this.table.tBody().on('click', '#cancel', this, this.onBtnCancel);
        this.table.tBody().on('click', '#save', this, this.onBtnSave);
    }
}