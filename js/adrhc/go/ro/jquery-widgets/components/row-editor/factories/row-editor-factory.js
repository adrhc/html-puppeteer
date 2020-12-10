class RowEditorFactory {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param editableRowTmplId {string}
     * @param editableRow {EditableRow}
     * @param buttonsRow {ButtonsRow}
     * @param rowEditorView {RowEditorView}
     * @return {RowEditorComponent}
     */
    create({
               mustacheTableElemAdapter, editableRowTmplId = "editableRowTmpl",
               editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId}),
               buttonsRow = new ButtonsRow(mustacheTableElemAdapter, {}),
               rowEditorView = new RowEditorView(editableRow, buttonsRow)
           }) {
        return new RowEditorComponent(rowEditorView);
    }

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param editableRowTmplId {string}
     * @param editableRow {EditableRow}
     * @param rowEditorView {RowEditorView}
     * @return {RowEditorComponent}
     */
    createWithNoButtons({
                            mustacheTableElemAdapter, editableRowTmplId = "editableRowTmpl",
                            editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId}),
                            rowEditorView = new RowEditorView(editableRow)
                        }) {
        return new RowEditorComponent(rowEditorView);
    }
}