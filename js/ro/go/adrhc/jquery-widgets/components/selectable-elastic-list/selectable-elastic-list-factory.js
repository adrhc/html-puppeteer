class SelectableElasticListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRow}
     * @param selectedRow {IdentifiableRow}
     * @return {SimpleListComponent}
     */
    create({
               items = [],
               tableId = "simpleList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(items),
               state = new SelectableElasticListState(),
               view = new SimpleListView(mustacheTableElemAdapter),
               notSelectedRow,
               selectedRow
           }) {
        return new SelectableElasticListComponent(mustacheTableElemAdapter, repository, state, view, notSelectedRow, selectedRow);
    }
}