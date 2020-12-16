class CrudListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRowComponent}
     * @param editableRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     * @return {CrudListComponent}
     */
    create({
               items = [],
               tableId = "crudList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(items),
               state = new EditableListState(),
               readOnlyRow,
               editableRow,
               view = new SelectableListView(mustacheTableElemAdapter, readOnlyRow, editableRow),
               deletableRow
           }) {
        return new CrudListComponent(repository, state, view, deletableRow);
    }
}