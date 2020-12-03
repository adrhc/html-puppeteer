class EditableTableView {
    constructor(readOnlyRow, editableRow, buttonsRow, htmlTableAdapter) {
        this.readOnlyRow = readOnlyRow;
        this.editableRow = editableRow;
        this.buttonsRow = buttonsRow;
        this.htmlTableAdapter = htmlTableAdapter;
    }

    init(data) {
        this.htmlTableAdapter.renderBody(data);
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
                // create/change to editable row view
                this.editableRow.show(sc.item);
                this.buttonsRow.show(sc.item)
            } else {
                this.buttonsRow.hide();
                if (sc.isTransient) {
                    // remove transient not selected row
                    this.readOnlyRow.hide(sc.item);
                } else {
                    // read-only show saved but not selected row
                    this.readOnlyRow.show(sc.item);
                }
            }
        })
    }
}