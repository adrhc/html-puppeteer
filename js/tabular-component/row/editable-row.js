class EditableRow extends ReadOnlyRow {
    constructor(table, rowTmpl) {
        super(table, rowTmpl);
    }

    show(tabularRowState, asNew) {
        super.show(tabularRowState, asNew);
        this.focusFirstInput(tabularRowState.index);
    }

    /**
     * private method
     */
    focusFirstInput(index) {
        const $row = this.table.tbody().find("tr").eq(index);
        const $inputToFocus = $row.find("input[name='firstName']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }
}