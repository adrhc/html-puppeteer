class EditableRow extends ReadOnlyRow {
    /**
     * @param tableElementAdapter {TableElementAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string}}
     */
    constructor(tableElementAdapter, config) {
        super(tableElementAdapter, config);
    }

    show(item) {
        super.show(item);
        this.focusFirstInput(item.id);
    }

    /**
     * private method
     */
    focusFirstInput(id) {
        const $row = this.tableElementAdapter.$tbody.find(`#${id}`);
        const $inputToFocus = $row.find("input[name='firstName']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }
}