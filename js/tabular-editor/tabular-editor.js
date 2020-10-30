class TabularEditor {
    constructor(items, tableId, readOnlyRowTemplate, editorTemplate) {
        this.context = new TabularEditorState(items);
        this.table = new Table(tableId);
        this.readOnlyRowTemplate = readOnlyRowTemplate;
        this.editorTemplate = editorTemplate;
    }

    /**
     * event handler
     */
    selectItem(rowElem) {
        if (this.context.selectionExists()) {
            this.context.selectedRow.hide();
            this.makeReadOnlyRow(this.context.selectedIndex);
        }
        this.makeEditableRow(rowElem.rowIndex - 1)
    }

    /**
     * initializer
     */
    render() {
        this.context.items.forEach((it, i) => this.makeReadOnlyRow(i));
        this.context.selectedRow = undefined;
    }

    /**
     * private
     */
    makeEditableRow(index) {
        this.context.selectedRow = this.editableRow(index);
        this.context.selectedRow.hide();
        this.context.selectedRow.render();
    }

    /**
     * private
     */
    makeReadOnlyRow(index) {
        this.context.selectedRow = this.readOnlyRow(index);
        this.context.selectedRow.render();
        this.configureRowEventHandlers();
    }

    /**
     * private
     */
    configureRowEventHandlers() {
        const row = this.context.selectedRow.htmlTableRowElement;
        row.ondblclick = () => this.selectItem(row);
    }

    /**
     * private
     */
    readOnlyRow(index) {
        return new ReadOnlyRow(index, this.context.items[index], this.table, this.readOnlyRowTemplate);
    }

    /**
     * private
     */
    editableRow(index) {
        return new EditableRow(index, this.context.items[index], this.table, this.editorTemplate);
    }
}