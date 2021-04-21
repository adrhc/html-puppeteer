class CreateDeleteListFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param items {IdentifiableEntity[]}
     * @param repository {CrudRepository}
     * @param crudListState {CrudListState}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param simpleListView {SimpleListView}
     * @param newItemsGoLast {boolean} whether to append or prepend
     * @param newEntityFactoryFn {function(): IdentifiableEntity}
     * @param bodyRowTmplHtml {string}
     * @param rowChildCompFactories {ChildComponentFactory|ChildComponentFactory[]} are components placed on a row
     * @param rowChildishBehaviourFactoryFn
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, index: number, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     * @param childishBehaviour {ChildishBehaviour} permit CreateDeleteListComponent to update its parent
     * @return {ElasticListComponent}
     */
    static create(elemIdOrJQuery, {
        items = [],
        repository = new InMemoryCrudRepository(items),
        newItemsGoLast,
        newEntityFactoryFn,
        crudListState = new CrudListState({newEntityFactoryFn, newItemsGoLast}),
        bodyRowTmplId,
        bodyRowTmplHtml,
        mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, bodyRowTmplId, bodyRowTmplHtml),
        simpleListView = new SimpleListView(mustacheTableElemAdapter),
        rowChildCompFactories,
        rowChildishBehaviourFactoryFn = (parentComp) => new DefaultChildishBehaviour(parentComp),
        idRowCompFactoryFn = (item, index, elasticListComponent) => {
            const idRowComp = SimpleRowFactory.createIdentifiableRow({
                mustacheTableElemAdapter: elasticListComponent.tableBasedView.tableAdapter,
                childCompFactories: rowChildCompFactories,
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
        const config = DomUtils.dataOf(elemIdOrJQuery);
        const createDeleteList = new CreateDeleteListComponent(repository, crudListState, simpleListView, idRowCompFactoryFn, config);
        if (childishBehaviour) {
            createDeleteList.childishBehaviour = childishBehaviour;
        }
        return createDeleteList;
    }
}