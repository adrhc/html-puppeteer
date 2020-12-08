class RowEditorView {
    /**
     * @param editableRow {EditableRow}
     * @param buttonsRow {ButtonsRow}
     */
    constructor({editableRow, buttonsRow}) {
        this.editableRow = editableRow;
        this.buttonsRow = buttonsRow;
    }

    /**
     * @param item {IdentifiableEntity}
     */
    show(item) {
        this.editableRow.show(item);
        this.buttonsRow.show(item)
    }

    /**
     * @param item {IdentifiableEntity}
     */
    hide(item) {
        this.buttonsRow.hide();
    }
}