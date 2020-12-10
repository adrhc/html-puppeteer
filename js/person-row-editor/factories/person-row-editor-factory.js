class PersonRowEditorFactory {
    create(mustacheTableElemAdapter, editableRowTmplId = "editableRowTmpl") {
        const editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId});
        const buttonsRow = new ButtonsRow(mustacheTableElemAdapter, {});
        const rowEditorView = new RowEditorView(editableRow, buttonsRow);
        return new PersonRowEditorComponent(rowEditorView);
    }
}