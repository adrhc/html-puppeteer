class ElasticSimpleListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param simpleRow {IdentifiableRow}
     * @return {ElasticSimpleListComponent}
     */
    create({
               items = [],
               tableId = "elasticSimpleList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(items),
               state = new CrudListState(),
               view = new SimpleListView(mustacheTableElemAdapter),
               simpleRow = SimpleRowFactory.prototype.createIdentifiableRow(
                   tableId, {
                       removeOnEmptyState: true
                   })
           }) {
        return new ElasticSimpleListComponent(mustacheTableElemAdapter, repository, state, view, simpleRow);
    }
}