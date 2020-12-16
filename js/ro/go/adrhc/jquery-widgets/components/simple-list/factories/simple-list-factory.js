class SimpleListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SimpleListState}
     * @param view {SimpleListView}
     * @return {SimpleListComponent}
     */
    create({
               items = [],
               tableId = "simpleList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(items),
               state = new SimpleListState(),
               view = new SimpleListView(mustacheTableElemAdapter)
           }) {
        return new SimpleListComponent(repository, state, view);
    }
}