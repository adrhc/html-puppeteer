class SelectableListFactory {
    /**
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param items {IdentifiableEntity[]}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param newItemsGoToTheEndOfTheList {boolean} whether to append or prepend
     * @param newEntityFactoryFn {function(): IdentifiableEntity}
     * @param state {SelectableListState}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     * @param view {SimpleListView}
     * @return {SelectableListComponent}
     */
    static create(tableIdOrJQuery, {
        items = [],
        bodyRowTmplId,
        mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId),
        repository = new InMemoryCrudRepository(items),
        newItemsGoToTheEndOfTheList,
        newEntityFactoryFn,
        state = new SelectableListState({newEntityFactoryFn, newItemsGoToTheEndOfTheList}),
        notSelectedRow,
        selectedRow,
        view = new SimpleListView(mustacheTableElemAdapter)
    }) {
        return new SelectableListComponent(repository, state, view, notSelectedRow, selectedRow);
    }
}