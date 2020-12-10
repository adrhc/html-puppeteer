class RowEditorFactory {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param editableRowTmplId {string}
     * @param buttonsRow {ButtonsRow}
     * @return {RowEditorComponent}
     */
    create({
               mustacheTableElemAdapter, editableRowTmplId = "editableRowTmpl",
               buttonsRow = new ButtonsRow(mustacheTableElemAdapter, {})
           }) {
        const editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId});
        const rowEditorView = new RowEditorView(editableRow, buttonsRow);
        return new RowEditorComponent(rowEditorView);
    }

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param editableRowTmplId {string}
     * @return {RowEditorComponent}
     */
    createWithNoButtons({mustacheTableElemAdapter, editableRowTmplId}) {
        const editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId});
        const rowEditorView = new RowEditorView(editableRow);
        return new RowEditorComponent(rowEditorView);
    }
}