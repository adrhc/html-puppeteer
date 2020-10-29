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
     * event
     */
    selectItem(rowElem) {
        // deactivate the previously opened editor if any
        this.deactivateEditorImpl();
        this.context.selectedIndex = rowElem.rowIndex - 1;
        this.activateEditorImpl();
    }

    /**
     * initializer
     */
    render() {
        this.context.items.forEach((it, i) => {
            this.context.selectedIndex = i;
            this.readOnlyRow.render(this.handlersSetter());
        })
    }

    /**
     * private
     */
    deactivateEditorImpl() {
        if (!this.context.selectionExists()) {
            return;
        }
        this.editableRow.hide(); // remove the editor
        this.readOnlyRow.render(this.handlersSetter());
    }

    /**
     * private
     */
    activateEditorImpl() {
        this.readOnlyRow.hide(); // remove the read-only row
        this.editableRow.render();
    }

    /**
     * private
     */
    handlersSetter() {
        const handlers = (row) => {
            row.ondblclick = () => this.selectItem(row);
        }
        return handlers.bind(this);
    }
}