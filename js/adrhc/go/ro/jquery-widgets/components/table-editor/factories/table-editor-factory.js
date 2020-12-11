class TableEditorFactory {
    /**
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param repository {CrudRepository}
     * @param rowEditorComponent {RowEditorComponent}
     * @return {TableEditorComponent}
     */
    create({
               tableId,
               bodyRowTmplId = "bodyRowTmplId",
               repository = new InMemoryCrudRepository(),
               rowEditorComponentFactory = RowEditorFactory.prototype.create
           }) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId);

        const rowEditorComponent = rowEditorComponentFactory(mustacheTableElemAdapter);

        const readOnlyRow = new ReadOnlyRow(mustacheTableElemAdapter, {rowTmplId: bodyRowTmplId});
        const tableEditorView = new TableEditorView(mustacheTableElemAdapter, readOnlyRow);
        return new TableEditorComponent(tableEditorView, mustacheTableElemAdapter, repository, rowEditorComponent);
    }
}