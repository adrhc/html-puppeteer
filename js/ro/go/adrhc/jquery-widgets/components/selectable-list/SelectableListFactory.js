class SelectableListFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param items {IdentifiableEntity[]}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param newItemsGoLast {boolean} whether to append or prepend
     * @param newEntityFactoryFn {function(): IdentifiableEntity}
     * @param state {SelectableListState}
     * @param offRow {IdentifiableRowComponent}
     * @param onRow {IdentifiableRowComponent}
     * @param view {SimpleListView}
     * @return {SelectableListComponent}
     */
    static create(elemIdOrJQuery, {
        items = [],
        bodyRowTmplId,
        mustacheTableElemAdapter = new MustacheTableElemAdapter({elemIdOrJQuery, bodyRowTmplId}),
        repository = new InMemoryCrudRepository(items),
        newItemsGoLast,
        newEntityFactoryFn,
        state = new SelectableListState({newEntityFactoryFn, newItemsGoLast}),
        offRow,
        onRow,
        view = new SimpleListView(mustacheTableElemAdapter)
    }) {
        return new SelectableListComponent(repository, state, view, offRow, onRow);
    }
}