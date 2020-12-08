class RowEditorComponent {
    /**
     * @param rowEditorState {RowEditorState}
     * @param rowEditorView {RowEditorView}
     */
    constructor(rowEditorState, rowEditorView) {
        this.rowEditorState = rowEditorState;
        this.rowEditorView = rowEditorView;
    }

    /**
     * @param item {TableEditorItem}
     */
    init(item) {
        this.rowEditorState.init(item).then(changes => this.rowEditorView.show(changes))
    }

    destroy() {
        this.rowEditorState.close().then(changes => this.rowEditorView.hide(changes))
    }
}