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
     * @param rowChildishBehaviourFactoryFn
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     * @param childishBehaviour {ChildishBehaviour} permit CreateDeleteListComponent to update its parent
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
        rowChildishBehaviourFactoryFn = (parentComp) =>
            new DefaultChildishBehaviour(parentComp, undefined),
        idRowCompFactoryFn = (item, afterItemId, elasticListComponent) => {
            const idRowComp = SimpleRowFactory.createIdentifiableRow({
                mustacheTableElemAdapter: elasticListComponent.tableBasedView.tableAdapter,
                childCompFactories: rowChildCompFactories,
                tableRelativePositionOnCreate: addNewRowsAtEnd ? "append" : "prepend"
            });
            const rowChildishBehaviour = rowChildishBehaviourFactoryFn(elasticListComponent);
            if (rowChildishBehaviour) {
                idRowComp.childishBehaviour = rowChildishBehaviour;
            }
            idRowComp.simpleRowState.update(item, "CREATE", afterItemId);
            return idRowComp;
        },
        childishBehaviour
    }) {
        const createDeleteList = new CreateDeleteListComponent(repository, crudListState, simpleListView, idRowCompFactoryFn);
        if (childishBehaviour) {
            createDeleteList.childishBehaviour = childishBehaviour;
        }
        return createDeleteList;
    }
}