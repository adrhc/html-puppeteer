class PersonRowEditorComponent extends RowEditorComponent {
    /**
     * @param rowEditorState {RowEditorState}
     * @param rowEditorView {RowEditorView}
     */
    constructor(rowEditorView, rowEditorState) {
        super(rowEditorView, rowEditorState);
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
     * @return {*} Person values
     */
    extractEntity() {
        const item = super.extractEntity(true);
        // item.cats = Object.values(this.catsTableEditor.state.items);
        item.cats = this.catsTableEditor.extractEntities();
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