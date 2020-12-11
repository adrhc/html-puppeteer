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
            .then(savedItem => editableTable._switchToEdit(
                editableTable.state.switchSelectionTo(savedItem.id, "CREATE")))
    }

    onSelectionSwitch(ev) {
        ev.stopPropagation();
    }

    /**
     * @param stateChanges {Promise<Array<StateChange>>}
     * @private
     */
    _switchToEdit(stateChanges) {
        stateChanges
            .then(it => {
                this.rowEditorComponent.close();
                return it;
            })
            .then(() => {
                this.rowEditorComponent.init(this.state.selectedItem);
            });
    }

    /**
     * @return {Promise<IdentifiableEntity>}
     * @private
     */
    _createPersistentEmptyItem() {
        const newItem = this.state.createNewItem(true);
        return this.repository.insert(IdentifiableEntity.prototype.clone(newItem))
            .then(savedItem => {
                this.state.removeTransientItem();
                this.state.insertItem(savedItem);
                return savedItem;
            });
    }
}