class ElasticListCompositeBehaviour extends CompositeBehaviour {
    /**
     * @param parentComp {ElasticListComponent}
     * @param idRowCompFactoryFn {function(entity: IdentifiableEntity, index: number, parent: ElasticListComponent): IdentifiableRowComponent}
     */
    constructor(parentComp, idRowCompFactoryFn) {
        super(parentComp);
        this.idRowCompFactoryFn = idRowCompFactoryFn;
        this.elasticListComponent = parentComp;
    }

    /**
     * @typedef {function(parentComp: AbstractComponent): AbstractComponent} childCompFactoryFn
     *
     * @param {Object} options
     * @param {ElasticListComponent} options.parentComponent
     * @param {boolean=} options.newItemsGoLast
     * @param {function(parentComponent: AbstractComponent): DefaultChildishBehaviour} options.rowChildishBehaviourFactoryFn
     * @param {function(item, index, elasticListComponent: ElasticListComponent): IdentifiableRowComponent} options.idRowCompFactoryFn
     * @param {childCompFactoryFn|Array<childCompFactoryFn>|ChildComponentFactory|ChildComponentFactory[]} options.rowChildCompFactories
     * @return {ElasticListCompositeBehaviour}
     */
    static of({
                  parentComponent,
                  newItemsGoLast,
                  rowChildishBehaviourFactoryFn,
                  idRowCompFactoryFn,
                  rowChildCompFactories
              }) {
        rowChildishBehaviourFactoryFn = rowChildishBehaviourFactoryFn ??
            ((parentComponent) => new DefaultChildishBehaviour(parentComponent));
        idRowCompFactoryFn = idRowCompFactoryFn ?? ElasticListCompositeBehaviour
            .idRowCompFactoryFnOf(newItemsGoLast, rowChildCompFactories, rowChildishBehaviourFactoryFn);
        return new ElasticListCompositeBehaviour(parentComponent, idRowCompFactoryFn);
    }

    /**
     * @param {boolean=} newItemsGoLast
     * @param {childCompFactoryFn|Array<childCompFactoryFn>|ChildComponentFactory|ChildComponentFactory[]} rowChildCompFactories
     * @param {function(parentComponent: AbstractComponent): DefaultChildishBehaviour} rowChildishBehaviourFactoryFn
     * @return {function(item, index, elasticListComponent): IdentifiableRowComponent}
     */
    static idRowCompFactoryFnOf(newItemsGoLast, rowChildCompFactories, rowChildishBehaviourFactoryFn) {
        return ((item, index, elasticListComponent) => {
            const idRowComp = new IdentifiableRowComponent({
                mustacheTableElemAdapter: elasticListComponent.tableBasedView.tableAdapter,
                childCompFactories: rowChildCompFactories,
                childishBehaviour: rowChildishBehaviourFactoryFn(elasticListComponent)
            });
            idRowComp.state.replace(new EntityRow(item, {index, append: newItemsGoLast}));
            return idRowComp;
        });
    }

    /**
     * @param id {number|string}
     * @return {IdentifiableRowComponent}
     */
    findKidById(id) {
        const kids = this.findKids((kid) => EntityUtils.idsAreEqual(kid.state.currentState.entity.id, id));
        AssertionUtils.isTrue(kids.length === 1);
        return kids[0];
    }

    /**
     * Creates child components from items while computing the afterRowId based on items ordering.
     *
     * @return {IdentifiableRowComponent[]}
     * @protected
     */
    _createChildComponents() {
        const items = this.parentComp.state.currentState;
        return items.map((item, index) => {
            return this.idRowCompFactoryFn(item, index, this.elasticListComponent);
        });
    }

    /**
     * @param {TaggedStateChange} stateChange
     * @return {IdentifiableRowComponent}
     */
    createChildComponent(stateChange) {
        const kid = this.idRowCompFactoryFn(stateChange.newStateOrPart,
            stateChange.newPartName, this.elasticListComponent);
        this.addChildComponent(kid);
        return kid;
    }
}