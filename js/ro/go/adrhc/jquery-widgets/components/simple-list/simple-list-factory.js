class SimpleListFactory {
    create({
               items = [],
               tableId = "simpleList",
               bodyRowTmplId = `${tableId}RowTmpl`,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(items),
               state = new SimpleListState(),
               view = new SimpleListView(mustacheTableElemAdapter)
           }) {
        return new SimpleListComponent(mustacheTableElemAdapter, repository, state, view);
    }
}