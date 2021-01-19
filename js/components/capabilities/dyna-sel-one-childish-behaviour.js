class DynaSelOneChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param childStateProperty {string} is the parentState property where to save the selectedItem
     * @param newChildEntityFactoryFn {function(): IdentifiableEntity}
     */
    constructor(parentComp, childStateProperty, newChildEntityFactoryFn) {
        super(parentComp, childStateProperty);
        this.newChildEntityFactoryFn = newChildEntityFactoryFn;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        const selectedItem = this._childComp.state.currentState;
        parentState[this.childStateProperty] = this._childEntityOf(selectedItem);
    }

    /**
     * I assume that parentComp will already be set!
     *
     * this.parentComp must be {IdentifiableRowComponent}
     *
     * @param childComp {DynamicSelectOneComponent}
     */
    set childComp(childComp) {
        this._updateWithDynaSelOneItem(childComp);
        this._childComp = childComp;
    }

    /**
     * @param childComp {DynamicSelectOneComponent}
     * @protected
     */
    _updateWithDynaSelOneItem(childComp) {
        const parentState = this.parentComp.state.currentState;
        const dynaSelOneItem = this.extractChildState(parentState);
        childComp.dynaSelOneState.updateWithDynaSelOneItem(dynaSelOneItem);
    }

    extractChildState(parentState) {
        const identifiableEntity = super.extractChildState(parentState);
        return this._childEntityOf(identifiableEntity);
    }

    _childEntityOf(data) {
        if (data == null) {
            return undefined;
        }
        return $.extend(true, this.newChildEntityFactoryFn(), data);
    }
}