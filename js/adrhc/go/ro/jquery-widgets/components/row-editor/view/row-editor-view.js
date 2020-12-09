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
        if (this.buttonsRow) {
            this.buttonsRow.show(item)
        }
    }

    /**
     * @param item {IdentifiableEntity}
     */
    hide(item) {
        if (this.buttonsRow) {
            this.buttonsRow.hide();
        }
    }
}