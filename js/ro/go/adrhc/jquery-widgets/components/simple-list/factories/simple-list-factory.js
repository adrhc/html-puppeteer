class SimpleListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string|undefined} could be empty when not using a row template (but only a table-rows template)
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SimpleListState}
     * @param view {SimpleListView}
     * @return {SimpleListComponent}
     */
    static create({
               items = [],
               tableIdOrJQuery,
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId),
               repository = new InMemoryCrudRepository(new EntityHelper(), items),
               state = new SimpleListState(),
               view = new SimpleListView(mustacheTableElemAdapter)
           }) {
        return new SimpleListComponent(repository, state, view);
    }
}