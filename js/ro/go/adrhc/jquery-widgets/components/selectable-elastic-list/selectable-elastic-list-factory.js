class SelectableElasticListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     * @param view {SimpleListView}
     * @return {SelectableElasticListComponent}
     */
    create({
               items = [],
               tableId = "simpleList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(items),
               state = new SelectableElasticListState(),
               notSelectedRow,
               selectedRow,
               view = new SelectableListView(mustacheTableElemAdapter, notSelectedRow, selectedRow)
           }) {
        return new SelectableElasticListComponent(repository, state, view);
    }
}