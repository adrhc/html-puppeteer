class SimpleListFactory {
    /**
     * @param [items] {IdentifiableEntity[]}
     * @param [elemIdOrJQuery] {string|jQuery<HTMLTableElement>}
     * @param [bodyRowTmplId] {string} could be empty when not using a row template (but only the table)
     * @param [bodyRowTmplHtml] {string}
     * @param [mustacheTableElemAdapter] {MustacheTableElemAdapter}
     * @param [repository] {CrudRepository}
     * @param [state] {SimpleListState}
     * @param [view] {SimpleListView}
     * @param [childProperty] {string}
     * @param [childishBehaviour] {ChildishBehaviour} permit CreateDeleteListComponent to update its parent
     * @return {SimpleListComponent}
     */
    static create(elemIdOrJQuery, {
        items = [],
        bodyRowTmplId,
        bodyRowTmplHtml,
        mustacheTableElemAdapter = new MustacheTableElemAdapter({elemIdOrJQuery, bodyRowTmplId, bodyRowTmplHtml}),
        repository = new InMemoryCrudRepository(items),
        state = new SimpleListState({}),
        view = new SimpleListView(mustacheTableElemAdapter),
        childProperty,
        childishBehaviour
    }) {
        return new SimpleListComponent({
            elemIdOrJQuery,
            items,
            bodyRowTmplId,
            bodyRowTmplHtml,
            mustacheTableElemAdapter,
            repository,
            state,
            view,
            childProperty,
            childishBehaviour
        });
    }
}