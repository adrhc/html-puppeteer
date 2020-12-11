class ListEditorFactory {
    create({
               items = [],
               tableId = "listEditor",
               bodyRowTmplId = "readOnlyListRowTmpl",
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               editableRowTmplId = "editableListRowTmpl",
               rowEditorComponentFactory = RowEditorFactory.prototype.createWithNoButtons
           }) {

        const rowEditorComponent = rowEditorComponentFactory({mustacheTableElemAdapter, editableRowTmplId});

        const tableEditorView = new TableEditorView(mustacheTableElemAdapter);
        return new ListEditorComponent(tableEditorView, mustacheTableElemAdapter,
            new InMemoryCrudRepository(items), rowEditorComponent);
    }
}