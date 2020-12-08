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
     * @param item {IdentifiableEntity}
     */
    init(item) {
        this.rowEditorState.init(item).then(stateChanges => this.rowEditorView.show(stateChanges))
    }

    destroy() {
        this.rowEditorState.close().then(stateChanges => this.rowEditorView.hide(stateChanges))
    }
}