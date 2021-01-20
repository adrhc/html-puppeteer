class ElasticListCompositeBehaviour extends CompositeBehaviour {

    /**
     * @param parentComp {ElasticListComponent}
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     */
    constructor(parentComp, idRowCompFactoryFn) {
        super(parentComp);
        this.idRowCompFactoryFn = idRowCompFactoryFn;
        this.elasticListComponent = parentComp;
    }

    processStateChangeWithKids(stateChange,
                               kidsFilter = (kid) => EntityUtils.haveSameId(kid.simpleRowState.rowState, stateChange.data),
                               stateChangeKidAdapter) {
        return super.processStateChangeWithKids(stateChange, kidsFilter, stateChangeKidAdapter);
    }

    /**
     * Creates child components from items while computing the afterItemId based on items ordering.
     *
     * @return {IdentifiableRowComponent[]}
     * @protected
     */
    _createChildComponents() {
        const items = this.parentComp.state.currentState;
        return items.map((item, index) => {
            const afterItemId = index === 0 ? undefined : items[index - 1].id;
            return this.idRowCompFactoryFn(item, afterItemId, this.elasticListComponent);
        });
    }

    /**
     * @param positionStateChange {PositionStateChange}
     * @return {IdentifiableRowComponent}
     */
    createChildComponent(positionStateChange) {
        return this.idRowCompFactoryFn(positionStateChange.data, positionStateChange.afterItemId, this.elasticListComponent);
    }
}