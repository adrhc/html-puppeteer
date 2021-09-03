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
     * @type {boolean|undefined}
     */
    dontAutoInitialize;

    /**
     * @type {CrudListState}
     */
    get crudListState() {
        return this.state;
    };

    /**
     * @return {ElasticListCompositeBehaviour}
     */
    get elasticListComposite() {
        return this.compositeBehaviour;
    }

    /**
     * @param {{}} options
     */
    constructor(options) {
        super({dontAutoInitialize: true, ...options});
        this.configurePartChangeHandlers({
            handleItemCreation: ["CREATE"],
            handleItemRemoval: ["DELETE"],
            handleItemUpdate: ["REPLACE"],
            updateViewOnAnyItem: [StateChangeHandlersManager.ALL_CHANGE_TYPES]
        }, "Item");
        this.dontAutoInitialize = this._dontAutoInitializeOf(options);
        this._handleAutoInitialization();
    }

    /**
     * see this.newItemsGoLast (computed property)
     *
     * @return {StateHolder}
     * @protected
     */
    _createStateHolder() {
        return new CrudListState({
            ...this.defaults, newItemsGoLast: this.newItemsGoLast
        });
    }

    /**
     * @return {EntityExtractor}
     * @protected
     */
    _createEntityExtractor() {
        return new ElasticListEntityExtractor(this);
    }

    /**
     * @return {CompositeBehaviour}
     * @protected
     */
    _createCompositeBehaviour() {
        return ElasticListCompositeBehaviour.of({
            ...this.defaults, parentComponent: this
        });
    }

    /**
     * Removes its kids then calls super._handleReload().
     */
    _handleReload() {
        return this.doWithState(() => {
            this.compositeBehaviour.childComponents.forEach(kid => {
                const kidEntityId = kid.state.currentState.entity.id;
                this.crudListState.removeById(kidEntityId);
            });
        }).then(() => super._handleReload());
    }

    /**
     * @param {TaggedStateChange<IdentifiableEntity>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemCreation(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnItemCREATE:\n${JSON.stringify(stateChange)}`);
        // positioning relies on using append=this.newItemsGoLast (index is ignored)
        return this.elasticListComposite.createChildComponent(stateChange).init();
    }

    /**
     * @param {TaggedStateChange<IdentifiableEntity>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemRemoval(stateChange) {
        console.log(`${this.constructor.name}.handleItemRemoval:\n${JSON.stringify(stateChange)}`);
        // positioning properties doesn't matter because the update is with undefined
        return this.kidOf(stateChange).update();
    }

    /**
     * This is an ElasticListComponent having SimpleListView as view which is able to handle a collection
     * of items but not a single item; for 1 item-update I'm delegating the update-view call to its row.
     *
     * @param {TaggedStateChange<IdentifiableEntity>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemUpdate(stateChange) {
        console.log(`${this.constructor.name}.handleItemUpdate:\n${JSON.stringify(stateChange)}`);
        // When a create/delete occurs before the update, the index (in CrudListState)
        // will change despite the fact that there's no position update necessary.
        //
        // index should not be used for positioning hence it's not even provided; each update
        // will actually land (row's PoV) on the same index (undefined) everytime, such that
        // the index change (in CrudListState) won't affect the positioning (row's PoV).
        return this.kidOf(stateChange).update(new EntityRow(stateChange.newStateOrPart));
    }

    /**
     * @param {StateChange<IdentifiableEntity>} stateChange
     * @return {IdentifiableRowComponent}
     */
    kidOf(stateChange) {
        const previousId = stateChange.previousStateOrPart.id;
        return this.elasticListComposite.findKidById(previousId);
    }

    /**
     * This doesn't make sense for ElasticListComponent which displays
     * itself through its children (see ElasticListCompositeBehaviour).
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny: removing all rows only\n${JSON.stringify(stateChange)}`);
        this.tableBasedView.tableAdapter.removeAllRows();
        return Promise.resolve(stateChange);
    }
}