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
        return this.rowEditorState.init(item).then(item => {
            this.rowEditorView.show(item);
            return item;
        })
    }

    close() {
        console.log("RowEditorComponent.close\n", this)
        return this.rowEditorState.close().then(item => {
            this.rowEditorView.hide(item);
            return item;
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
        if (!this.rowEditorView.buttonsRow) {
            return undefined;
        }
        return this.rowEditorView.buttonsRow.buttonsRowDataId;
    }
}