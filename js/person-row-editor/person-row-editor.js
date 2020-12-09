class PersonRowEditorComponent extends RowEditorComponent {
    /**
     * @param rowEditorState {RowEditorState}
     * @param rowEditorView {RowEditorView}
     */
    constructor({rowEditorState, rowEditorView}) {
        super({rowEditorState, rowEditorView});
    }

    init(item) {
        return super.init(item).then((it) => {
            this.catsTableEditor = CatsTableEditorFactory.prototype.create({cats: item.cats});
            this.catsTableEditor.init();
            return it;
        });
    }

    close() {
        if (!this.catsTableEditor) {
            return;
        }
        this.catsTableEditor.close();
        return super.close();
    }
}