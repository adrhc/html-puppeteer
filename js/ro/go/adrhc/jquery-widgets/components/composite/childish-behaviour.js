/**
 * this encapsulates the "child component" capability of a component
 */
class ChildishBehaviour {
    /**
     * childComp means "me/this/current" relative to ChildishBehaviour
     *
     * @type {AbstractComponent}
     */
    _childComp
    /**
     * @type {AbstractComponent}
     */
    parentComp;

    /**
     * @param parentComp {AbstractComponent}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    get childComp() {
        return this._childComp;
    }

    set childComp(value) {
        this._childComp = value;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean} whether something was copied or not
     */
    copyChildState(parentState, useOwnerOnFields) {
        return false;
    }
}