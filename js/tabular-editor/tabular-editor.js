class TabularEditor {
    constructor(items, tableId, readOnlyRowTemplate, editorTemplate) {
        this.context = new TabularEditorState(items);
        this.table = new TableView(tableId);
        this.readOnlyRowTemplate = readOnlyRowTemplate;
        this.editorTemplate = editorTemplate;
        this.readOnlyRow = new RowView(this.context, this.table, this.readOnlyRowTemplate);
        this.editableRow = new RowView(this.context, this.table, this.editorTemplate);
    }

    /**
     * event handler
     */
    selectItem(rowElem) {
        if (this.context.selectionExists()) {
            this.changeSelectionToReadOnly();
        }
        this.context.selectedIndex = rowElem.rowIndex - 1;
        this.changeSelectionToEditable();
    }

    /**
     * initializer
     */
    render() {
        this.context.items.forEach((it, i) => {
            this.context.selectedIndex = i;
            this.renderReadOnlySelection();
        })
        this.context.selectedIndex = undefined;
    }

    /**
     * private
     */
    changeSelectionToEditable() {
        this.readOnlyRow.hide(); // remove the read-only row
        this.editableRow.show();
    }

    /**
     * private
     */
    changeSelectionToReadOnly() {
        this.editableRow.hide(); // remove the editor
        this.renderReadOnlySelection();
    }

    /**
     * private
     */
    renderReadOnlySelection() {
        this.readOnlyRow.show();
        this.configureRowEventHandlers();
    }

    /**
     * private
     */
    configureRowEventHandlers() {
        const row = this.table.getRowAt(this.context.selectedIndex);
        row.ondblclick = () => this.selectItem(row);
    }
}