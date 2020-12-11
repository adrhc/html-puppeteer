class ButtonsRow extends ReadOnlyRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string, buttonsRowDataId: string}}
     */
    constructor(mustacheTableElemAdapter, config) {
        super(mustacheTableElemAdapter, $.extend({
            rowTmplHtml:
                `<tr data-owner="${mustacheTableElemAdapter.tableId}" data-id="buttons" class="buttons-row">
                    <td colspan="${mustacheTableElemAdapter.columnsCount}">
                        <button data-owner="${mustacheTableElemAdapter.tableId}" type="button" name="cancelBtn">Cancel</button>
                        <button data-owner="${mustacheTableElemAdapter.tableId}" type="button" name="saveBtn">Save</button>
                    </td>
                </tr>`
        }, config));
        this.buttonsRowDataId = config.buttonsRowDataId ? config.buttonsRowDataId : "buttons";
    }

    hide() {
        this.mustacheTableElemAdapter.deleteRowByDataId(this.buttonsRowDataId);
    }

    /**
     * @param item {IdentifiableEntity}
     */
    show(item) {
        this.mustacheTableElemAdapter.renderRowAfterDataId(item.id, this.rowTmplHtml);
    }
}