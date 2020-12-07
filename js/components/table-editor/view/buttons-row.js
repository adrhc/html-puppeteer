class ButtonsRow extends ReadOnlyRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string, buttonsRowId: string}}
     */
    constructor(mustacheTableElemAdapter, config) {
        super(mustacheTableElemAdapter, $.extend({
            rowTmplHtml:
                `<tr id="buttons" class="buttons-row">
                    <td colspan="${mustacheTableElemAdapter.columnsCount}">
                        <button type="button" id="cancelBtn">Cancel</button>
                        <button type="button" id="saveBtn">Save</button>
                    </td>
                </tr>`
        }, config));
        this.buttonsRowId = config && config.buttonsRowId ? config.buttonsRowId : "buttons";
    }

    hide() {
        this.mustacheTableElemAdapter.deleteRowById(this.buttonsRowId);
    }

    show(item) {
        const editorRowId = this.mustacheTableElemAdapter.getRowIndexById(item.id);
        super.renderRow(editorRowId + 1);
    }
}