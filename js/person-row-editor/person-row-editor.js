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
            // this.catsTableEditor = CatsTableEditorFactory.prototype.create({cats: item.cats});
            this.catsTableEditor = ListEditorFactory.prototype.create({
                items: item.cats,
                tableId: "catsTable",
                bodyRowTmplId: "readOnlyCatsRowTmpl",
                editableRowTmplId: "editableCatsRowTmpl"
            });
            this.catsTableEditor.init();
            return it;
        });
    }

    /**
     * @param editedId {string}
     * @return {*} Person values
     */
    entityValuesFor(editedId) {
        const item = super.entityValuesFor(editedId);
        item.cats = Object.values(this.catsTableEditor.state.items);
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