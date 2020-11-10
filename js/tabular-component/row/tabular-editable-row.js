class TabularEditableRow extends TabularRow {
    constructor(tabularEditorState, table, rowTmpl) {
        super(tabularEditorState, table, rowTmpl);
    }

    show(asNew) {
        super.show(asNew);
        this.focusFirstInput();
    }

    /**
     * private method
     */
    focusFirstInput() {
        const $row = this.table.tBody().find("tr").eq(this.context.selectedIndex);
        const $inputToFocus = $row.find("input[name='firstName']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }
}