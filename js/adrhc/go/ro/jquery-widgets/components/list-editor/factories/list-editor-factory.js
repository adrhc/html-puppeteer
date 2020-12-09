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

        const readOnlyRow = new ReadOnlyRow(mustacheTableElemAdapter, {rowTmplId: bodyRowTmplId});
        const tableEditorView = new TableEditorView(readOnlyRow, mustacheTableElemAdapter);
        return new ListEditorComponent(tableEditorView, mustacheTableElemAdapter,
            new InMemoryTableEditorRepository(items), rowEditorComponent);
    }
}