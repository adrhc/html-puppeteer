class EditableListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {EditableListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRowComponent}
     * @param editableRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     * @return {EditableListComponent}
     */
    create({
               items = [],
               tableId = "crudList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(new EntityHelper(), items),
               state = new EditableListState(),
               readOnlyRow,
               editableRow,
               deletableRow,
               view = new SimpleListView(mustacheTableElemAdapter)
           }) {
        return new EditableListComponent(repository, state, view, readOnlyRow, editableRow, deletableRow);
    }
}