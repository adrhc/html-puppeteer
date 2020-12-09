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
            return Promise.reject();
        }
        stateChanges.forEach(sc => {
            if (sc.isTransient) {
                if (sc.isSelected) {
                    this.mustacheTableElemAdapter.prependEmptyRow(sc.item.id);
                } else {
                    this.mustacheTableElemAdapter.deleteRowByDataId(sc.item.id)
                }
            } else {
                this.readOnlyRow.show(sc.item);
            }
        })
        return Promise.resolve(stateChanges);
    }

    /**
     * @param tr {HTMLTableRowElement}
     * @return {string}
     */
    rowDataIdOf(tr) {
        const $elem = $(tr);
        const ownerSelector = this.mustacheTableElemAdapter.ownerSelector;
        if ($elem.is(ownerSelector)) {
            return $(tr).data("id");
        } else {
            return $(tr).parents(`tr${ownerSelector}`).data("id");
        }
    }
}