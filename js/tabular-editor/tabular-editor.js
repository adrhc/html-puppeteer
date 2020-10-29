class TabularEditor {
    constructor(items, tableId, readOnlyRowTemplate, editorTemplate) {
        this.context = new TabularEditorState(items);
        this.table = new Table(tableId);
        this.readOnlyRowTemplate = readOnlyRowTemplate;
        this.editorTemplate = editorTemplate;
    }

    deactivateEditorImpl() {
        if (!this.context.selectionExists()) {
            return;
        }
        let view = new EditableRow(this.context, this.table, this.editorTemplate);
        view.hide(); // remove the editor
        view = new ReadOnlyRow(this.context, this.table, this.readOnlyRowTemplate)
        view.render(this.configureEventHandlers.bind(this));
    }

    activateEditorImpl() {
        let view = new ReadOnlyRow(this.context, this.table, this.readOnlyRowTemplate);
        view.hide();
        view = new EditableRow(this.context, this.table, this.editorTemplate);
        view.render();
    }

    selectItem(rowElem) {
        // deactivate the previously opened editor if any
        this.deactivateEditorImpl();
        this.context.selectedIndex = rowElem.rowIndex - 1;
        this.activateEditorImpl();
    }

    init() {
        const readOnlyRow = new ReadOnlyRow(this.context, this.table, this.readOnlyRowTemplate)
        this.context.items.forEach((it, i) => {
            this.context.selectedIndex = i;
            readOnlyRow.render(this.configureEventHandlers.bind(this));
        })
    }

    configureEventHandlers(row) {
        row.ondblclick = () => this.selectItem(row);
    }
}