class EditableRow extends ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        super(htmlTableAdapter, rowTmpl);
    }

    show(rowState, asNew) {
        super.show(rowState, asNew);
        this.focusFirstInput(rowState.index);
    }

    /**
     * private method
     */
    focusFirstInput(index) {
        const $row = this.htmlTableAdapter.$tbody().find("tr").eq(index);
        const $inputToFocus = $row.find("input[name='firstName']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }
}