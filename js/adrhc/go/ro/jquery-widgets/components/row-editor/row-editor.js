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
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {*}
     */
    extractEntity(useOwnerOnFields) {
        const $row = this.rowEditorView.$getRowByDataId(this.rowEditorState.item.id);
        return EntityFormUtils.prototype.extractEntityFrom($row, useOwnerOnFields ? this.owner : undefined);
    }

    get buttonsRowDataId() {
        if (!this.rowEditorView.buttonsRow) {
            return undefined;
        }
        return this.rowEditorView.buttonsRow.buttonsRowDataId;
    }

    get owner() {
        return this.rowEditorView.owner;
    }
}