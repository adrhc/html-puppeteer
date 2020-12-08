class RowEditorComponent {
    /**
     * @param rowEditorState {RowEditorState}
     * @param rowEditorView {RowEditorView}
     */
    constructor({rowEditorState = new RowEditorState(), rowEditorView}) {
        this.rowEditorState = rowEditorState;
        this.rowEditorView = rowEditorView;
    }

    /**
     * @param item {IdentifiableEntity}
     */
    init(item) {
        console.log("RowEditorComponent.init\n", item)
        this.rowEditorState.init(item).then(stateChanges => this.rowEditorView.show(stateChanges))
    }

    destroy() {
        console.log("RowEditorComponent.destroy\n", this)
        this.rowEditorState.close().then(stateChanges => this.rowEditorView.hide(stateChanges))
    }

    /**
     * @param editedId {string}
     * @return {*}
     */
    entityValuesFor(editedId) {
        const item = this.rowEditorView.editableRow.valuesFor(editedId);
        EntityUtils.prototype.removeTransientId(item);
        return item;
    }

    get buttonsRowDataId() {
        return this.rowEditorView.buttonsRow.buttonsRowDataId;
    }
}