class ListEditorFactory {
    create({
               items = [],
               tableId = "listEditor",
               bodyRowTmplId = "readOnlyListRowTmpl",
               editableRowTmplId = "editableListRowTmpl",
               rowEditorComponentFactory = RowEditorFactory.prototype.create
           }) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId);

        const rowEditorComponent = rowEditorComponentFactory({mustacheTableElemAdapter, editableRowTmplId});

        const tableEditorView = new TableEditorView(mustacheTableElemAdapter);
        return new ListEditorComponent(tableEditorView, mustacheTableElemAdapter,
            new InMemoryTableEditorRepository(items), rowEditorComponent);
    }
}