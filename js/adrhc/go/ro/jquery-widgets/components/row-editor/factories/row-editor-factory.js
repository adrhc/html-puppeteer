class RowEditorFactory {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param editableRowTmplId {string}
     * @param buttonsRow {ButtonsRow}
     * @return {RowEditorComponent}
     */
    create({mustacheTableElemAdapter, editableRowTmplId = "editableRowTmpl", buttonsRow}) {
        const editableRow = new EditableRow(mustacheTableElemAdapter, {rowTmplId: editableRowTmplId});
        buttonsRow = buttonsRow ? buttonsRow : new ButtonsRow(mustacheTableElemAdapter, {});
        const rowEditorView = new RowEditorView({editableRow: editableRow, buttonsRow: buttonsRow});
        return new RowEditorComponent({rowEditorView});
    }

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param editableRowTmplId {string}
     * @return {RowEditorComponent}
     */
    createWithNoButtons({mustacheTableElemAdapter, editableRowTmplId}) {
        return RowEditorFactory.prototype.create({
            mustacheTableElemAdapter,
            editableRowTmplId,
            buttonsRow: new NoButtonsRow()
        });
    }
}