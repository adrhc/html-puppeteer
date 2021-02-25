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
     * When having kids and useOwnerOnFields is null than the owner is used despite
     * useOwnerOnFields value otherwise the useOwnerOnFields value is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        // selectedItem should already be a curated entity such that childEntityConverter would be useless
        const selectedItem = this._childComp.state.currentState.selectedItem;
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
        this._childComp = childComp;
        const parentState = this.parentComp.state.currentState;
        const dynaSelOneItem = this.extractChildState(parentState);
        childComp.dynaSelOneState.updateWithDynaSelOneItem(dynaSelOneItem);
    }
}