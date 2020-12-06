class EditableRow extends ReadOnlyRow {
    /**
     * @param htmlTableAdapter {HtmlTableAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string}}
     */
    constructor(htmlTableAdapter, config) {
        super(htmlTableAdapter, config);
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