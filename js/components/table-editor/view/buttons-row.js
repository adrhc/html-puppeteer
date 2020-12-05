class ButtonsRow extends ReadOnlyRow {
    constructor(htmlTableAdapter, rowTmplId) {
        super(htmlTableAdapter, rowTmplId);
    }

    hide() {
        this.htmlTableAdapter.deleteRowById("buttons");
    }

    show(item) {
        const editorRowId = this.htmlTableAdapter.getRowIndexById(item.id);
        super.renderRow(editorRowId + 1);
    }
}