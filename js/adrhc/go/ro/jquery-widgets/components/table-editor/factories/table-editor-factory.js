class TableEditorFactory {
    /**
     * @param tableId {string}
     * @param repository {TableEditorRepository}
     * @param bodyRowTmplId {string}
     * @param rowEditorComponent {RowEditorComponent}
     * @return {TableEditorComponent}
     */
    create({
               tableId,
               repository = new InMemoryTableEditorRepository(),
               bodyRowTmplId = "readOnlyRowTmpl",
               rowEditorComponentFactory = RowEditorFactory.prototype.create
           }) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId);

        const rowEditorComponent = rowEditorComponentFactory(mustacheTableElemAdapter);

        const readOnlyRow = new ReadOnlyRow(mustacheTableElemAdapter, {rowTmplId: bodyRowTmplId});
        const tableEditorView = new TableEditorView(mustacheTableElemAdapter, readOnlyRow);
        return new TableEditorComponent(tableEditorView, mustacheTableElemAdapter, repository, rowEditorComponent);
    }
}