class CatsTableEditorFactory {
    create({
               cats = {},
               tableId = "catsTable",
               bodyRowTmplId = "readOnlyCatsRowTmpl",
               rowEditorComponentFactory = RowEditorFactory.prototype.create
           }) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId);

        const rowEditorComponent = rowEditorComponentFactory({
            mustacheTableElemAdapter: mustacheTableElemAdapter, editableRowTmplId: "editableCatsRowTmpl"
        });

        const readOnlyRow = new ReadOnlyRow(mustacheTableElemAdapter, {rowTmplId: bodyRowTmplId});
        const tableEditorView = new TableEditorView(readOnlyRow, mustacheTableElemAdapter);
        return new TableEditorComponent(tableEditorView, mustacheTableElemAdapter,
            new InMemoryTableEditorRepository(cats), rowEditorComponent);
    }
}