class SimpleListFactory {
    /**
     * @param [items] {IdentifiableEntity[]}
     * @param [tableIdOrJQuery] {string|jQuery<HTMLTableElement>}
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
    static create({
                      items = [],
                      tableIdOrJQuery,
                      bodyRowTmplId,
                      bodyRowTmplHtml,
                      mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId, bodyRowTmplHtml),
                      repository = new InMemoryCrudRepository(items),
                      state = new SimpleListState(),
                      view = new SimpleListView(mustacheTableElemAdapter),
                      childProperty,
                      childishBehaviour
                  }) {
        const comp = new SimpleListComponent(repository, state, view);
        if (childProperty) {
            comp.childishBehaviour = new DefaultChildishBehaviour(comp, childProperty);
        } else if (childishBehaviour) {
            comp.childishBehaviour = childishBehaviour;
        }
        return comp;
    }
}