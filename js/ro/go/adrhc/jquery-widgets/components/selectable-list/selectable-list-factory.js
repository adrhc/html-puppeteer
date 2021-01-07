class SelectableListFactory {
    /**
     * @param items {IdentifiableEntity[]}
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     * @param view {SimpleListView}
     * @return {SelectableListComponent}
     */
    static create({
                      items = [],
                      tableIdOrJQuery,
                      bodyRowTmplId,
                      mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId),
                      repository = new InMemoryCrudRepository(items),
                      state = new SelectableListState(),
                      notSelectedRow,
                      selectedRow,
                      view = new SimpleListView(mustacheTableElemAdapter)
                  }) {
        return new SelectableListComponent(repository, state, view, notSelectedRow, selectedRow);
    }
}