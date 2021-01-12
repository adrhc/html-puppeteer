class CreateDeleteListFactory {
    /**
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string}
     * @param items {IdentifiableEntity[]}
     * @param repository {CrudRepository}
     * @param crudListState {CrudListState}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param simpleListView {SimpleListView}
     * @param addNewRowsAtEnd {boolean} whether to append or prepend
     * @param rowChildCompFactories {ChildComponentFactory|ChildComponentFactory[]} are components placed on a row
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, mustacheTableElemAdapter: MustacheTableElemAdapter): IdentifiableRowComponent}
     * @param childOperations {ChildishBehaviour} permit CreateDeleteListComponent to update its parent
     * @return {ElasticListComponent}
     */
    static create(tableIdOrJQuery, bodyRowTmplId, {
        items = [],
        repository = new InMemoryCrudRepository(items),
        addNewRowsAtEnd,
        crudListState = new CrudListState(addNewRowsAtEnd),
        mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId),
        simpleListView = new SimpleListView(mustacheTableElemAdapter),
        rowChildCompFactories,
        idRowCompFactoryFn = (item, afterItemId, mustacheTableElemAdapter) => {
            const idRowComp = SimpleRowFactory.createIdentifiableRow({
                mustacheTableElemAdapter,
                childCompFactories: rowChildCompFactories,
                tableRelativePositionOnCreate: addNewRowsAtEnd ? "append" : "prepend"
            });
            idRowComp.simpleRowState.update(item, "CREATE", afterItemId);
            return idRowComp;
        },
        childOperations
    }) {
        const createDeleteList = new CreateDeleteListComponent(repository, crudListState, simpleListView, idRowCompFactoryFn);
        if (childOperations) {
            createDeleteList.childComponent = childOperations;
        }
        return createDeleteList;
    }
}