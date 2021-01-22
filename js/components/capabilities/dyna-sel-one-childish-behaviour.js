class DynaSelOneChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param childStateProperty {string} is the parentState property where to save the selectedItem
     * @param childEntityConverter {function({}): IdentifiableEntity}
     */
    constructor(parentComp, childStateProperty, childEntityConverter) {
        super(parentComp, childStateProperty);
        this.childEntityConverter = childEntityConverter;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        const selectedItem = this._childComp.state.currentState;
        parentState[this.childStateProperty] = this.childEntityConverter(selectedItem);
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
        return this.childEntityConverter(identifiableEntity);
    }
}