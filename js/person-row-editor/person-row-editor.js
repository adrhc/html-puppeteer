class PersonRowEditorComponent extends RowEditorComponent {
    /**
     * @param rowEditorState {RowEditorState}
     * @param rowEditorView {RowEditorView}
     */
    constructor({rowEditorState, rowEditorView}) {
        super({rowEditorState, rowEditorView});
    }

    /**
     * @param item {Person}
     * @return {Promise<IdentifiableEntity>}
     */
    init(item) {
        return super.init(item).then((it) => {
            this.catsTableEditor = CatsTableEditorFactory.prototype.create({cats: item.cats});
            this.catsTableEditor.init();
            return it;
        });
    }

    /**
     * @param editedId {string}
     * @return {*} Person values
     */
    entityValuesFor(editedId) {
        const item = this.rowEditorView.editableRow.valuesFor(editedId);
        EntityUtils.prototype.removeTransientId(item);
        item.cats = this.catsTableEditor.state.items;
        return item;
    }

    close() {
        if (!this.catsTableEditor) {
            return;
        }
        this.catsTableEditor.close();
        return super.close();
    }
}