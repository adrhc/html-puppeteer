class RowEditorView {
    /**
     * @param editableRow {EditableRow}
     * @param buttonsRow {ButtonsRow}
     */
    constructor(editableRow, buttonsRow) {
        this.editableRow = editableRow;
        this.buttonsRow = buttonsRow;
    }

    /**
     * @param item {IdentifiableEntity}
     * @param putAtBottomIfNotExists {boolean|undefined}
     */
    show(item, putAtBottomIfNotExists) {
        this.editableRow.show(item, putAtBottomIfNotExists);
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

    /**
     * @param rowDataId
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowByDataId(rowDataId) {
        return this.editableRow.mustacheTableElemAdapter.$getRowByDataId(rowDataId);
    }

    get owner() {
        return this.editableRow.mustacheTableElemAdapter.tableId;
    }
}