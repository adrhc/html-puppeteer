class TableEditorView {
    /**
     * @param readOnlyRow {ReadOnlyRow}
     * @param editableRow {EditableRow}
     * @param buttonsRow {ButtonsRow}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(readOnlyRow, editableRow, buttonsRow, mustacheTableElemAdapter) {
        this.readOnlyRow = readOnlyRow;
        this.editableRow = editableRow;
        this.buttonsRow = buttonsRow;
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
    }

    init(data) {
        this.mustacheTableElemAdapter.renderBody(data);
    }

    /**
     * @param stateChanges {StateChange[]|undefined}
     */
    updateView(stateChanges) {
        if (!stateChanges) {
            // selection not changed, do nothing
            return;
        }
        stateChanges.forEach(sc => {
            if (sc.isSelected) {
                // create/change-to "editable" row view
                this.editableRow.show(sc.item);
                this.buttonsRow.show(sc.item)
            } else {
                this.buttonsRow.hide();
                if (sc.isTransient) {
                    // remove transient, not selected row
                    this.readOnlyRow.hide(sc.item);
                } else {
                    // show saved (but not selected) row as read-only
                    this.readOnlyRow.show(sc.item);
                }
            }
        })
    }

    /**
     * @param tr {HTMLTableRowElement}
     * @return {string}
     */
    rowDataIdOf(tr) {
        return $(tr).data("id");
    }
}