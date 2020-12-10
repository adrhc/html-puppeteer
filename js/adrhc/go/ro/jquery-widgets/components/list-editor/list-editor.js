class ListEditorComponent extends TableEditorComponent {
    /**
     * @param editableTableView {TableEditorView}
     * @param tableElementAdapter {TableElementAdapter}
     * @param repository {TableEditorRepository}
     * @param rowEditorComponent {RowEditorComponent}
     * @param state {TableEditorState}
     */
    constructor(editableTableView, tableElementAdapter, repository, rowEditorComponent, state) {
        super(editableTableView, tableElementAdapter, repository, rowEditorComponent, state);
    }

    /**
     * new-item-creation event handler
     *
     * @param ev {Event}
     */
    onNewItem(ev) {
        const editableTable = ev.data;
        editableTable._createPersistentEmptyItem()
            .then(savedItem => {
                editableTable._switchToEdit(editableTable.state.switchSelectionTo(savedItem.id));
            })
    }

    /**
     * @return {Promise<IdentifiableEntity>}
     * @private
     */
    _createPersistentEmptyItem() {
        const newItem = this.state.insertNewItem();
        return this.repository.insert(newItem)
            .then(savedItem => {
                editableTable.state.removeTransientItem();
                editableTable.state.replaceItem(savedItem);
                return savedItem;
            });
    }
}