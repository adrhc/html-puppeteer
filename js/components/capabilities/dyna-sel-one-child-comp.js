class DynaSelOneChildComp extends ChildComponent {
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
            parentState.person = $.extend(new Person(), dynaSelOneState.selectedItem);
        } else {
            parentState.person = undefined;
        }
        return true;
    }

    /**
     * this.parentComp must be {IdentifiableRowComponent}
     *
     * @param value {DynamicSelectOneComponent}
     */
    set kidComp(value) {
        /**
         * @type {Person}
         */
        const person = this.parentComp.simpleRowState.rowState.person;
        value.dynaSelOneState.updateWithDynaSelOneItem(person);
        this._kidComp = value;
    }
}