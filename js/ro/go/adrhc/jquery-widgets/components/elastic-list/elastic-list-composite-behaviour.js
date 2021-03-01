class ElasticListCompositeBehaviour extends CompositeBehaviour {

    /**
     * @param parentComp {ElasticListComponent}
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterRowId: number|string, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
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
        const kids = this.findKids((kid) => EntityUtils.idsAreEqual(kid.state.currentState.id, id));
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
            const afterRowId = index === 0 ? undefined : items[index - 1].id;
            return this.idRowCompFactoryFn(item, afterRowId, this.elasticListComponent);
        });
    }

    /**
     * @param positionStateChange {PositionStateChange}
     * @return {IdentifiableRowComponent}
     */
    createChildComponent(positionStateChange) {
        const kid = this.idRowCompFactoryFn(positionStateChange.data,
            positionStateChange.afterRowId, this.elasticListComponent);
        this.addChildComponent(kid);
        return kid;
    }
}