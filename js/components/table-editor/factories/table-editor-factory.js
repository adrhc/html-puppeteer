class TableEditorFactory {
    /**
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param editableRowTmplId {string}
     * @param repository {TableEditorRepository}
     * @return {TableEditorComponent}
     */
    create({
               tableId,
               repository = new InMemoryTableEditorRepository(),
               bodyRowTmplId = "readOnlyRowTmpl",
               editableRowTmplId = "editableRowTmpl"
           }) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId);
        const readOnlyRow = new ReadOnlyRow(mustacheTableElemAdapter, {rowTmplId: bodyRowTmplId});
        const editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId});
        const buttonsRow = new ButtonsRow(mustacheTableElemAdapter);
        const tableEditorView = new TableEditorView(readOnlyRow, editableRow, buttonsRow, mustacheTableElemAdapter);
        return new TableEditorComponent(tableEditorView, mustacheTableElemAdapter, repository);
    }
}