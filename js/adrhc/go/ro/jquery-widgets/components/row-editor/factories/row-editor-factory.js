class RowEditorFactory {
    create({mustacheTableElemAdapter, editableRowTmplId = "editableRowTmpl"}) {
        const editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId});
        const buttonsRow = new ButtonsRow(mustacheTableElemAdapter, {});
        const rowEditorView = new RowEditorView({editableRow: editableRow, buttonsRow: buttonsRow});
        return new RowEditorComponent({rowEditorView: rowEditorView});
    }
}