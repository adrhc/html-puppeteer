class DynaSelOneChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param {AbstractComponent} parentComp
     * @param {string} childProperty is the parentState property where to save the selectedItem
     * @param {function(parentState: *): *} [childEntityGetter]
     * @param {function(childEntity: IdentifiableEntity, parentState: *): void} [childEntitySetter]
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter] converts extracted raw data to IdentifiableEntity
     */
    constructor(parentComp, {childProperty, childEntityGetter, childEntitySetter, childEntityConverter}) {
        super(parentComp, {
            childProperty,
            childEntityGetter,
            childEntitySetter,
            childEntityExtractorFn: () => this._childComp.state.currentState.selectedItem,
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
        const dynaSelOneItem = this.getChildEntityFrom(parentState);
        childComp.dynaSelOneState.updateWithDynaSelOneItem(dynaSelOneItem);
    }
}