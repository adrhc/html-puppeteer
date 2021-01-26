class DynaSelOneChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param childStateProperty {string} is the parentState property where to save the selectedItem
     * @param componentStateToEntityConverter {function({}): IdentifiableEntity}
     */
    constructor(parentComp, childStateProperty, componentStateToEntityConverter) {
        super(parentComp, childStateProperty);
        this.componentStateToEntityConverter = componentStateToEntityConverter;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used despite
     * useOwnerOnFields value otherwise the useOwnerOnFields value is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        const selectedItem = this._childComp.state.currentState;
        parentState[this.childStateProperty] = this.componentStateToEntityConverter(selectedItem);
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
        return this.componentStateToEntityConverter(identifiableEntity);
    }
}