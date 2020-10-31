/**
 * Role: capture all table events
 */
class TabularEditor {
    constructor(items, tableId, readOnlyRowTemplate, editorTemplate) {
        this.context = new TabularEditorState(items);
        this.table = new HtmlTableAdapter(tableId);
        this.readOnlyRowTemplate = readOnlyRowTemplate;
        this.editorTemplate = editorTemplate;
        this.readOnlyRow = new RowView(this.context, this.table,
            this.readOnlyRowTemplate, this.rowEventHandlersConfigFn.bind(this));
        this.editableRow = new RowView(this.context, this.table, this.editorTemplate);
    }

    /**
     * event handler
     */
    selectItem(rowElem) {
        if (this.context.selectionExists()) {
            this.switchRepresentation(this.editableRow, this.readOnlyRow);
        }
        this.context.selectedRow = rowElem.rowIndex - 1;
        this.switchRepresentation(this.readOnlyRow, this.editableRow);
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
     *
     * @param row for which to configure the event handlers
     */
    rowEventHandlersConfigFn(row) {
        row.ondblclick = () => this.selectItem(row);
    }
}