class DynaSelOneChildishBehaviour extends ChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param parentProperty {string} is the parentState property where to save the selectedItem
     * @param newParentPropertyInstanceFactoryFn {function(): IdentifiableEntity}
     */
    constructor(parentComp, parentProperty, newParentPropertyInstanceFactoryFn) {
        super(parentComp);
        this.parentProperty = parentProperty;
        this.newEntityFactoryFn = newParentPropertyInstanceFactoryFn;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        /**
         * @type {DynaSelOneState}
         */
        const dynaSelOneState = this._childComp.dynaSelOneState;
        if (dynaSelOneState.selectedItem) {
            parentState[this.parentProperty] = $.extend(this.newEntityFactoryFn(), dynaSelOneState.selectedItem);
        } else {
            parentState[this.parentProperty] = undefined;
        }
        return true;
    }

    /**
     * this.parentComp must be {IdentifiableRowComponent}
     *
     * @param value {DynamicSelectOneComponent}
     */
    set childComp(value) {
        const identifiableEntity = this.parentComp.simpleRowState.rowState[this.parentProperty];
        value.dynaSelOneState.updateWithDynaSelOneItem(identifiableEntity);
        this._childComp = value;
    }
}