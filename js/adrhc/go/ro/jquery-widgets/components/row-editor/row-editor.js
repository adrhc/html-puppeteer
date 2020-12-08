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
        return this.rowEditorState.init(item).then(stateChanges => {
            this.rowEditorView.show(stateChanges);
            return stateChanges;
        })
    }

    destroy() {
        console.log("RowEditorComponent.destroy\n", this)
        return this.rowEditorState.close().then(stateChanges => {
            this.rowEditorView.hide(stateChanges);
            return stateChanges;
        })
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