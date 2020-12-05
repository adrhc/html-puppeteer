class EditableRow extends ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        super(htmlTableAdapter, rowTmpl);
    }

    show(item) {
        super.show(item);
        this.focusFirstInput(item.id);
    }

    /**
     * private method
     */
    focusFirstInput(id) {
        const $row = this.htmlTableAdapter.$tbody.find(`#${id}`);
        const $inputToFocus = $row.find("input[name='firstName']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }
}