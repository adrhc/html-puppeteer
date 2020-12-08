class ButtonsRow extends ReadOnlyRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string, buttonsRowDataId: string}}
     */
    constructor(mustacheTableElemAdapter, config) {
        super(mustacheTableElemAdapter, $.extend({
            rowTmplHtml:
                `<tr data-id="buttons" class="buttons-row">
                    <td colspan="${mustacheTableElemAdapter.columnsCount}">
                        <button type="button" name="cancelBtn">Cancel</button>
                        <button type="button" name="saveBtn">Save</button>
                    </td>
                </tr>`
        }, config));
        this.buttonsRowDataId = config.buttonsRowDataId ? config.buttonsRowDataId : "buttons";
    }

    hide() {
        this.mustacheTableElemAdapter.deleteRowByDataId(this.buttonsRowDataId);
    }

    show(item) {
        const editorRowId = this.mustacheTableElemAdapter.getRowIndexByDataId(item.id);
        super.renderRow(editorRowId + 1);
    }
}