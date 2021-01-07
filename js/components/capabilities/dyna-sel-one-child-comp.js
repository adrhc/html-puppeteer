class DynaSelOneChildComp extends ChildComponent {
    /**
     * @param parentComp {AbstractComponent}
     * @param parentProperty {string} is the parentState property where to save the selectedItem
     * @param newEntityFactoryFn {function(): IdentifiableEntity}
     */
    constructor(parentComp, parentProperty, newEntityFactoryFn) {
        super(parentComp);
        this.parentProperty = parentProperty;
        this.newEntityFactoryFn = newEntityFactoryFn;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean}
     */
    copyKidState(parentState, useOwnerOnFields) {
        /**
         * @type {DynaSelOneState}
         */
        const dynaSelOneState = this._kidComp.dynaSelOneState;
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
    set kidComp(value) {
        const identifiableEntity = this.parentComp.simpleRowState.rowState[this.parentProperty];
        value.dynaSelOneState.updateWithDynaSelOneItem(identifiableEntity);
        this._kidComp = value;
    }
}