class ElasticSimpleListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param putAtBottomIfNotExists {boolean|undefined}
     * @param simpleRow {SimpleRow}
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
               putAtBottomIfNotExists,
               simpleRow = SimpleRowFactory.prototype.createSimpleRow(tableId, {
                   bodyRowTmplId,
                   putAtBottomIfNotExists
               })
           }) {
        return new ElasticSimpleListComponent(mustacheTableElemAdapter, repository, state, view, simpleRow);
    }
}