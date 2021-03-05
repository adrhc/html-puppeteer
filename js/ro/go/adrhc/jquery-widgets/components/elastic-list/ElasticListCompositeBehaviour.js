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
     * @param id {number|string}
     * @return {AbstractComponent}
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
        const kid = this.idRowCompFactoryFn(stateChange.stateOrPart.entity,
            stateChange.stateOrPart.index, this.elasticListComponent);
        this.addChildComponent(kid);
        return kid;
    }
}