class DynaSelOneChildishBehaviour extends ConfigurableChildishBehaviour {
    /**
     * @param {AbstractComponent} parentComp
     * @param {string} childProperty is the parentState property where to save the selectedItem
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter]
     */
    constructor(parentComp, childProperty, childEntityConverter) {
        super(parentComp, childProperty, {
            childEntityConverter,
            childRawDataExtractor: () => this._childComp.state.currentState.selectedItem
        });
    }

    /**
     * I assume that parentComp will already be set!
     *
     * this.parentComp must be {IdentifiableRowComponent}
     *
     * @param childComp {DynamicSelectOneComponent}
     */
    set childComp(childComp) {
        this._childComp = childComp;
        const parentState = this.parentComp.state.currentState;
        const dynaSelOneItem = this.childStateFrom(parentState);
        childComp.dynaSelOneState.updateWithDynaSelOneItem(dynaSelOneItem);
    }
}