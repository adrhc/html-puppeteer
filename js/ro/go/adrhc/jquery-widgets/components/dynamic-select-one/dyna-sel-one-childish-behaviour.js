class DynaSelOneChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param childStateProperty {string} is the parentState property where to save the selectedItem
     * @param childCompToEntityConverter {function({}): IdentifiableEntity} converts child-component state-snapshot to child entity
     * @param parentSectionToChildEntityConverter {function({}): IdentifiableEntity} converts the portion from parent that belongs to the child to child entity
     */
    constructor(parentComp, childStateProperty, childCompToEntityConverter,
                parentSectionToChildEntityConverter = childCompToEntityConverter) {
        super(parentComp, childStateProperty);
        this.childCompToEntityConverter = childCompToEntityConverter;
        this.parentSectionToChildEntityConverter = parentSectionToChildEntityConverter;
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
        parentState[this.childStateProperty] = this.childCompToEntityConverter(selectedItem);
    }

    /**
     * I assume that parentComp will already be set!
     *ddd
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

    extractChildState(parentState) {
        const childStateFromParent = super.extractChildState(parentState);
        return this.parentSectionToChildEntityConverter(childStateFromParent);
    }
}