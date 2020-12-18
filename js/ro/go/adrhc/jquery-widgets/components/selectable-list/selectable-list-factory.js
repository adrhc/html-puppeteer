class SelectableListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     * @param view {SimpleListView}
     * @return {SelectableListComponent}
     */
    create({
               items = [],
               tableId = "simpleList",
               bodyRowTmplId,
               mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, bodyRowTmplId),
               repository = new InMemoryCrudRepository(new EntityHelper(), items),
               state = new SelectableListState(),
               notSelectedRow,
               selectedRow,
               view = new SimpleListView(mustacheTableElemAdapter)
           }) {
        return new SelectableListComponent(repository, state, view, notSelectedRow, selectedRow);
    }
}