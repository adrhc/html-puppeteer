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
        this.configureRowEvents();
    }

    /**
     * event handler
     */
    onRowSelected(ev) {
        const tabularEditor = ev.data;
        if (tabularEditor.context.selectionExists()) {
            tabularEditor.switchRepresentation(tabularEditor.editableRow, tabularEditor.readOnlyRow);
        }
        tabularEditor.context.selectedRow = this.rowIndex - 1;
        tabularEditor.switchRepresentation(tabularEditor.readOnlyRow, tabularEditor.editableRow);
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
     *
     * @param from: the representation to hide
     * @param to: the representation to show
     */
    switchRepresentation(from, to) {
        from.hide();
        to.show();
    }

    /**
     * private method
     */
    configureRowEvents() {
        $(`#${this.table.tableId} tbody`).on('dblclick', 'tr', this, this.onRowSelected);
    }
}