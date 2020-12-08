class TableEditorView {
    /**
     * @param readOnlyRow {ReadOnlyRow}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(readOnlyRow, mustacheTableElemAdapter) {
        this.readOnlyRow = readOnlyRow;
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
                // row was created & selected or just selected
                // switch to "editable" row view
            } else {
                // row was deselected
                // remove the buttons row
                if (sc.isTransient) {
                    // remove transient row
                    this.readOnlyRow.hide(sc.item);
                } else {
                    // show as "read-only" the nontransient row
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