class DynaSelOneChildishBehaviour extends ConfigurableChildishBehaviour {
    /**
     * @param {AbstractComponent} parentComp
     * @param {string} childProperty is the parentState property where to save the selectedItem
     * @param {function(parentState: *): *} [childGetter]
     * @param {function(childEntity: IdentifiableEntity, parentState: *): void} [childSetter]
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter] converts extracted raw data to IdentifiableEntity
     */
    constructor(parentComp, {childProperty, childGetter, childSetter, childEntityConverter}) {
        super(parentComp, {
            childProperty,
            childGetter,
            childSetter,
            childRawDataExtractor: () => this._childComp.state.currentState.selectedItem,
            childEntityConverter
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