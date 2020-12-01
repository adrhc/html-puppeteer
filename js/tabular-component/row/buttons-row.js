class ButtonsRow extends ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmpl) {
        super(htmlTableAdapter, rowTmpl);
    }

    hide() {
        this.htmlTableAdapter.deleteRowById("buttons");
    }

    show(rowState) {
        const editorRowId = this.htmlTableAdapter.getRowIndexById(rowState.id);
        super.renderRow(editorRowId + 1);
    }
}