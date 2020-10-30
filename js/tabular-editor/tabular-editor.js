class TabularEditor {
    constructor(items, tableId, readOnlyRowTemplate, editorTemplate) {
        this.context = new TabularEditorState(items);
        this.table = new Table(tableId);
        this.readOnlyRowTemplate = readOnlyRowTemplate;
        this.editorTemplate = editorTemplate;
        this.readOnlyRow = new ReadOnlyRow(this.context, this.table, this.readOnlyRowTemplate);
        this.editableRow = new EditableRow(this.context, this.table, this.editorTemplate);
    }

    /**
     * event handler
     */
    selectItem(rowElem) {
        if (!this.context.selectionExists()) {
            return;
        }
        this.makeReadOnlyRow();
        this.context.selectedIndex = rowElem.rowIndex - 1;
        this.makeEditableRow();
    }

    /**
     * initializer
     */
    render() {
        this.context.items.forEach((it, i) => {
            this.context.selectedIndex = i;
            this.readOnlyRow.render();
            this.setRowEventsHandlers();
        })
    }

    /**
     * private
     */
    makeReadOnlyRow() {
        this.editableRow.hide(); // remove the editor
        this.readOnlyRow.render();
        this.setRowEventsHandlers();
    }

    /**
     * private
     */
    makeEditableRow() {
        this.readOnlyRow.hide(); // remove the read-only row
        this.editableRow.render();
    }

    /**
     * private
     */
    setRowEventsHandlers() {
        const row = this.table.getRowAt(this.context.selectedIndex);
        row.ondblclick = () => this.selectItem(row);
    }
}