class SelectableListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
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
               state = new SelectableListState(),
               view = new SimpleListView(mustacheTableElemAdapter),
               notSelectedRow, selectedRow
           }) {
        return new SelectableListComponent(mustacheTableElemAdapter, repository, state, view, notSelectedRow, selectedRow);
    }
}