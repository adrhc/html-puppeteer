class EditableRow extends ReadOnlyRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string}}
     */
    constructor(mustacheTableElemAdapter, config) {
        super(mustacheTableElemAdapter, config);
    }

    show(item) {
        super.show(item);
        this.focusFirstInput(item.id);
    }

    /**
     * private method
     */
    focusFirstInput(rowId) {
        const $row = this.mustacheTableElemAdapter.$getRowById(rowId);
        const $inputToFocus = $row.find("input[name='firstName']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }
}