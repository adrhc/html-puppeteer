class ButtonsRow extends ReadOnlyRow {
    /**
     * @param tableElementAdapter {TableElementAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string, buttonsRowId: string}}
     */
    constructor(tableElementAdapter, config) {
        super(tableElementAdapter, $.extend({
            rowTmplHtml:
                `<tr id="buttons" class="buttons-row">
                    <td colspan="${tableElementAdapter.columnsCount}">
                        <button type="button" id="cancelBtn">Cancel</button>
                        <button type="button" id="saveBtn">Save</button>
                    </td>
                </tr>`
        }, config));
        this.buttonsRowId = config && config.buttonsRowId ? config.buttonsRowId : "buttons";
    }

    hide() {
        this.tableElementAdapter.deleteRowById(this.buttonsRowId);
    }

    show(item) {
        const editorRowId = this.tableElementAdapter.getRowIndexById(item.id);
        super.renderRow(editorRowId + 1);
    }
}