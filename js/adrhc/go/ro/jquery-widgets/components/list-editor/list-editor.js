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
        this.editableTableView.appendNewRows = true;
    }

    /**
     * new-item-creation event handler
     *
     * @param ev {Event}
     */
    onNewItem(ev) {
        const editableTable = ev.data;
        editableTable._createPersistentEmptyItem()
            .then(savedItem => editableTable._switchToEdit(editableTable.state.switchSelectionTo(savedItem.id)))
    }

    onSelectionSwitch(ev) {
        ev.stopPropagation();
    }

    /**
     * @return {Promise<IdentifiableEntity>}
     * @private
     */
    _createPersistentEmptyItem() {
        const newItem = this.state.insertNewItem(true);
        return this.repository.insert(newItem)
            .then(savedItem => {
                this.state.removeTransientItem();
                this.state.replaceItem(savedItem);
                return savedItem;
            });
    }
}