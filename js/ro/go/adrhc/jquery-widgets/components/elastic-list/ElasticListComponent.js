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
     * @param stateChange {TaggedStateChange}
     * @return {Promise}
     */
    handleItemCreation(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnItemCREATE:\n${JSON.stringify(stateChange)}`);
        // positioning relies on this.newItemsGoLast
        return this.elasticListComposite.createChildComponent(stateChange).init();
    }

    handleItemRemoval(stateChange) {
        console.log(`${this.constructor.name}.handleItemRemoval:\n${JSON.stringify(stateChange)}`);
        return this.kidOf(stateChange).update();
    }

    /**
     * This is an ElasticListComponent having SimpleListView as view which is able to handle a collection
     * of items but not a single item; for 1 item-update I'm delegating the update-view call to its row.
     *
     * @param {StateChange<IdentifiableEntity>} stateChange
     * @return {Promise}
     */
    handleItemUpdate(stateChange) {
        console.log(`${this.constructor.name}.handleItemUpdate:\n${JSON.stringify(stateChange)}`);
        // When a create/delete occurs before the update, the index will
        // change despite the fact that there's no position update necessary.
        return this.kidOf(stateChange).update(
            new EntityRow(stateChange.newStateOrPart, {index: stateChange.newPartName}));
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