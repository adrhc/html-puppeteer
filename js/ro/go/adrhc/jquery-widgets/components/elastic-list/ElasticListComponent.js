/**
 * A component acting as a container for its kids.
 * Its view is irrelevant because is composed by the kids views!
 *
 * Q: what represents "state" for ElasticListComponent?
 * A1: "state" could be the list of children identifiers while children too will store their state
 * A2: "state" could be the list loaded from the repository; children just duplicate the state
 * Note: having a list means we implicitly have the children positions
 */
class ElasticListComponent extends SimpleListComponent {
    /**
     * @type {CrudListState}
     */
    crudListState;

    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId
     * @param bodyRowTmplHtml
     * @param bodyTmplHtml
     * @param rowDataId
     * @param rowPositionOnCreate
     * @param childProperty
     * @param dontAutoInitialize
     * @param {ComponentConfiguration} [config]
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, index: number, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     * @param items
     * @param newItemsGoLast
     * @param newEntityFactoryFn
     * @param mustacheTableElemAdapter
     * @param rowChildCompFactories
     * @param rowChildishBehaviourFactoryFn
     * @param childishBehaviour
     * @param parentComponent
     */
    constructor({
                    elemIdOrJQuery,
                    bodyRowTmplId,
                    bodyRowTmplHtml,
                    bodyTmplHtml,
                    rowDataId,
                    rowPositionOnCreate,
                    childProperty,
                    dontAutoInitialize,
                    config = ComponentConfiguration.configWithOverrides(elemIdOrJQuery, {
                        bodyRowTmplId,
                        bodyRowTmplHtml,
                        bodyTmplHtml,
                        rowDataId,
                        rowPositionOnCreate,
                        childProperty,
                        dontAutoInitialize
                    }),
                    items = typeof config.items === "string" ? JSON.parse(config.items) : config.items ?? [],
                    repository = new InMemoryCrudRepository(items),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, config),
                    newEntityFactoryFn,
                    state = new CrudListState({
                        newEntityFactoryFn,
                        newItemsGoLast: mustacheTableElemAdapter.rowPositionOnCreate !== "prepend"
                    }),
                    view = new SimpleListView(mustacheTableElemAdapter),
                    rowChildCompFactories,
                    rowChildishBehaviourFactoryFn = (parentComp) => new DefaultChildishBehaviour(parentComp),
                    idRowCompFactoryFn = (item, index, elasticListComponent) => {
                        const idRowComp = new IdentifiableRowComponent({
                            mustacheTableElemAdapter: elasticListComponent.tableBasedView.tableAdapter,
                            childCompFactories: rowChildCompFactories,
                            childishBehaviour: rowChildishBehaviourFactoryFn(elasticListComponent)
                        });
                        idRowComp.state.replaceEntirely(new EntityRow(item, {index}));
                        return idRowComp;
                    },
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent
                }
    ) {
        // the "super" missing parameters (e.g. bodyRowTmplId) are included in "config" or they are
        // simply intermediate values (e.g. elemIdOrJQuery is used to compute mustacheTableElemAdapter)
        super({
            config: config.dontAutoInitializeOf(),
            repository,
            state,
            view,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent
        });
        this.config = config; // the "config" set by "super" is different (see line above)
        this.entityExtractor = new ElasticListEntityExtractor(this);
        this.crudListState = state;
        this.configurePartChangeHandlers({handleItemCreation: ["CREATE"]}, "Item");
        this._setupCompositeBehaviour(new ElasticListCompositeBehaviour(this, idRowCompFactoryFn), childCompFactories);
        return this._handleAutoInitialization();
    }

    /**
     * Removes its kids then calls super._handleReload().
     */
    _handleReload() {
        return this.doWithState(() => {
            this.compositeBehaviour.childComponents.forEach(kid => {
                this.crudListState.removeById(kid.state.currentState.entity.id);
            });
        }).then(() => super._handleReload());
    }

    /**
     * @param stateChange {TaggedStateChange}
     * @return {Promise}
     */
    handleItemCreation(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnItemCREATE:\n${JSON.stringify(stateChange)}`);
        return this.elasticListComposite.createChildComponent(stateChange).init();
    }

    /**
     * This is an ElasticListComponent where its view (SimpleListView) is able to handle a collection
     * of items but not a single item; for 1 item-update I'm delegating to its row the update-view call.
     *
     * @param stateChange
     * @return {Promise}
     */
    updateViewOnAnyItem(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAnyITEM:\n${JSON.stringify(stateChange)}`);
        const previousId = stateChange.previousStateOrPart.entity.id;
        const idRowComp = this.elasticListComposite.findKidById(previousId);
        return idRowComp.update(stateChange.stateOrPart);
    }

    /**
     * This doesn't make sense for ElasticListComponent which displays
     * itself through its children (see ElasticListCompositeBehaviour).
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny: ignored\n${JSON.stringify(stateChange)}`);
        this.tableBasedView.tableAdapter.removeAllRows();
        return Promise.resolve(stateChange);
    }

    /**
     * @return {ElasticListCompositeBehaviour}
     */
    get elasticListComposite() {
        return this.compositeBehaviour;
    }
}