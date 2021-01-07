class DynaSelOneChildComp extends ChildComponent {
    copyKidState(parentState) {
        parentState.person = $.extend(new Person(), this.kidComp.extractEntity(true));
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