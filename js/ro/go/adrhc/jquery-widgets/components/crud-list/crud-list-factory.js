class CrudListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRow}
     * @param editableRow {IdentifiableRow}
     * @return {CrudListFactory}
     */
    create({
               items = [],
               tableId = "crudList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(items),
               state = new SelectableElasticListState(),
               view = new SimpleListView(mustacheTableElemAdapter),
               readOnlyRow,
               editableRow
           }) {
        return new CrudListComponent(mustacheTableElemAdapter, repository, state, view, readOnlyRow, editableRow);
    }
}