class SimpleListFactory {
    create({
               items = [],
               tableId = "simpleList",
               bodyRowTmplId = `${tableId}RowTmpl`,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId)
           }) {
        return new SimpleListComponent(mustacheTableElemAdapter, new InMemoryCrudRepository(items));
    }
}