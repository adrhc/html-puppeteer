class ElasticListFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string}
     * @param items {IdentifiableEntity[]}
     * @param repository {CrudRepository}
     * @param crudListState {CrudListState}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param simpleListView {SimpleListView}
     * @param newItemsGoLast {boolean} whether to append or prepend
     * @param newEntityFactoryFn {function(): IdentifiableEntity}
     * @param rowChildCompFactories {ChildComponentFactory|ChildComponentFactory[]}
     * @param rowChildishBehaviourFactoryFn
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, index: number, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     * @param childishBehaviour
     * @return {ElasticListComponent}
     */
    static create(elemIdOrJQuery, bodyRowTmplId, {
        items = [],
        repository = new InMemoryCrudRepository(items),
        newItemsGoLast,
        newEntityFactoryFn,
        crudListState = new CrudListState({newEntityFactoryFn, newItemsGoLast}),
        mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, bodyRowTmplId),
        simpleListView = new SimpleListView(mustacheTableElemAdapter),
        rowChildCompFactories,
        rowChildishBehaviourFactoryFn = (parentComp) => new DefaultChildishBehaviour(parentComp),
        idRowCompFactoryFn = (item, index, elasticListComponent) => {
            const idRowComp = SimpleRowFactory.createIdentifiableRow({
                mustacheTableElemAdapter: elasticListComponent.tableBasedView.tableAdapter,
                childCompFactories: rowChildCompFactories,
                childishBehaviour,
                tableRelativePositionOnCreate: newItemsGoLast ? "append" : "prepend"
            });
            const rowChildishBehaviour = rowChildishBehaviourFactoryFn(elasticListComponent);
            if (rowChildishBehaviour) {
                idRowComp.childishBehaviour = rowChildishBehaviour;
            }
            idRowComp.state.replaceEntirely(new EntityRow(item, {index}));
            return idRowComp;
        },
        childishBehaviour
    }) {
        const elasticListComponent = new ElasticListComponent(repository, crudListState, simpleListView, idRowCompFactoryFn);
        if (childishBehaviour) {
            elasticListComponent.childishBehaviour = childishBehaviour;
        }
        return elasticListComponent;
    }
}