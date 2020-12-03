class ButtonsRow extends ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        super(htmlTableAdapter, rowTmpl);
    }

    hide() {
        this.htmlTableAdapter.deleteRowById("buttons");
    }

    show(item) {
        const editorRowId = this.htmlTableAdapter.getRowIndexById(item.id);
        super.renderRow(editorRowId + 1);
    }
}