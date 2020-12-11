class SimpleTableFactory {
    create({
               items = [],
               tableId = "simpleTableTmpl",
               bodyRowTmplId = "simpleTableRowTmpl",
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId)
           }) {
        return new SimpleTable(mustacheTableElemAdapter, new InMemoryCrudRepository(items));
    }
}