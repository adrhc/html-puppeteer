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
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, index: number, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     * @param {ComponentConfiguration} [config]
     */
    constructor(repository, state, view, idRowCompFactoryFn, config) {
        super(repository, state, view, config);
        this.compositeBehaviour = new ElasticListCompositeBehaviour(this, idRowCompFactoryFn);
        this.entityExtractor = new ElasticListEntityExtractor(this, {});
        this.crudListState = state;
        this.configurePartChangeHandlers({handleItemCreation: ["CREATE"]}, "Item");
    }

    /**
     * @return {ElasticListCompositeBehaviour}
     */
    get elasticListComposite() {
        return this.compositeBehaviour;
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
        return idRowComp.update(stateChange.stateOrPart, {});
    }

    /**
     * This doesn't make sense for ElasticListComponent which displays
     * itself through its children (see ElasticListCompositeBehaviour).
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny: ignored\n${JSON.stringify(stateChange)}`);
        return Promise.resolve(stateChange);
    }
}