/**
 * this encapsulates the "child component" capability of a component
 */
class ChildComponent {
    /**
     * kidComp means "me/this/current" relative to ChildComponent
     *
     * @type {AbstractComponent}
     */
    _kidComp
    /**
     * @type {AbstractComponent}
     */
    parentComp;

    /**
     * @param parentComp {AbstractComponent|undefined}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    get kidComp() {
        return this._kidComp;
    }

    set kidComp(value) {
        this._kidComp = value;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean} whether something was copied or not
     */
    copyKidState(parentState, useOwnerOnFields) {
        return false;
    }
}