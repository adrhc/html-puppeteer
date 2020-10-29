class TabularEditor {
    selectedItem = undefined;

    constructor(items, tableId, readOnlyRowTemplate, editorTemplate) {
        this.context = new TabularEditorState(items);
        this.table = new Table(tableId);
        this.readOnlyRowTemplate = readOnlyRowTemplate;
        this.editorTemplate = editorTemplate;
    }

    restoreReadOnlyView() {
        if (!this.selectedItem) {
            return;
        }
        this.selectedItem.hide(); // remove the editor
        this.selectedItem = new ReadOnlyRow(this.context, this.table, this.readOnlyRowTemplate)
        this.selectedItem.render(this.configureEventHandlers.bind(this));
    }

    activateEditor(rowElem) {
        // deactivate the previously opened editor if any
        this.restoreReadOnlyView();
        this.context.selectedIndex = rowElem.rowIndex - 1;
        this.selectedItem = new ReadOnlyRow(this.context, this.table, this.readOnlyRowTemplate);
        this.selectedItem.hide();
        this.selectedItem = new EditableRow(this.context, this.table, this.editorTemplate);
        this.selectedItem.render();
    }

    init() {
        this.selectedItem = new ReadOnlyRow(this.context, this.table, this.readOnlyRowTemplate)
        this.context.items.forEach((it, i) => {
            this.context.selectedIndex = i;
            this.selectedItem.render(this.configureEventHandlers.bind(this));
        })
    }

    configureEventHandlers(row) {
        row.ondblclick = () => this.activateEditor(row);
    }
}