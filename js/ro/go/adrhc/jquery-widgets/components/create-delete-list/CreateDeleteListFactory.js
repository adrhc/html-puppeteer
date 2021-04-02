class CreateDeleteListFactory {
    /**
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param items {IdentifiableEntity[]}
     * @param repository {CrudRepository}
     * @param crudListState {CrudListState}
     * @param bodyRowTmplId {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param simpleListView {SimpleListView}
     * @param newItemsGoToTheEndOfTheList {boolean} whether to append or prepend
     * @param newEntityFactoryFn {function(): IdentifiableEntity}
     * @param bodyRowTmplHtml {string}
     * @param rowChildCompFactories {ChildComponentFactory|ChildComponentFactory[]} are components placed on a row
     * @param rowChildishBehaviourFactoryFn
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, index: number, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     * @param childishBehaviour {ChildishBehaviour} permit CreateDeleteListComponent to update its parent
     * @return {ElasticListComponent}
     */
    static create(tableIdOrJQuery, {
        items = [],
        repository = new InMemoryCrudRepository(items),
        newItemsGoToTheEndOfTheList,
        newEntityFactoryFn,
        crudListState = new CrudListState({newEntityFactoryFn, newItemsGoToTheEndOfTheList}),
        bodyRowTmplId,
        bodyRowTmplHtml,
        mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId, bodyRowTmplHtml),
        simpleListView = new SimpleListView(mustacheTableElemAdapter),
        rowChildCompFactories,
        rowChildishBehaviourFactoryFn = (parentComp) => new DefaultChildishBehaviour(parentComp),
        idRowCompFactoryFn = (item, index, elasticListComponent) => {
            const idRowComp = SimpleRowFactory.createIdentifiableRow({
                mustacheTableElemAdapter: elasticListComponent.tableBasedView.tableAdapter,
                childCompFactories: rowChildCompFactories,
                tableRelativePositionOnCreate: newItemsGoToTheEndOfTheList ? "append" : "prepend"
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
        const props = DomUtils.jQueryOf(tableIdOrJQuery).data();
        const configFn = (config) => $.extend(new ComponentConfiguration(), props, config);
        const config = configFn({});
        const createDeleteList = new CreateDeleteListComponent(repository, crudListState, simpleListView, idRowCompFactoryFn, config);
        if (childishBehaviour) {
            createDeleteList.childishBehaviour = childishBehaviour;
        }
        return createDeleteList;
    }
}