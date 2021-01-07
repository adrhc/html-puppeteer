class EditableListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {EditableListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRowComponent}
     * @param editableRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     * @param childComponent {ChildComponent}
     * @return {EditableListComponent}
     */
    static create({
                      items = [],
                      tableIdOrJQuery,
                      bodyRowTmplId,
                      mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId),
                      repository = new InMemoryCrudRepository(items),
                      state = new EditableListState(),
                      view = new SimpleListView(mustacheTableElemAdapter),
                      readOnlyRow,
                      editableRow,
                      deletableRow,
                      childComponent
                  }) {
        const editableListComponent = new EditableListComponent(repository, state, view, readOnlyRow, editableRow, deletableRow);
        if (childComponent) {
            editableListComponent.childComponent = childComponent;
        }
        return editableListComponent;
    }
}