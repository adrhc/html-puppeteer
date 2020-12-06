class ButtonsRow extends ReadOnlyRow {
    /**
     * @param htmlTableAdapter {HtmlTableAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string, buttonsRowId: string}}
     */
    constructor(htmlTableAdapter, config) {
        super(htmlTableAdapter, $.extend({
            rowTmplHtml:
                `<tr id="buttons" class="buttons-row">
                    <td colspan="3">
                        <button type="button" id="cancelBtn">Cancel</button>
                        <button type="button" id="saveBtn">Save</button>
                    </td>
                </tr>`
        }, config));
        this.buttonsRowId = config && config.buttonsRowId ? config.buttonsRowId : "buttons";
    }

    hide() {
        this.htmlTableAdapter.deleteRowById(this.buttonsRowId);
    }

    show(item) {
        const editorRowId = this.htmlTableAdapter.getRowIndexById(item.id);
        super.renderRow(editorRowId + 1);
    }
}