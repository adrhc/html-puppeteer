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

    /**
     * This should happen after setting the parent! usually this should
     * happen anyway because the parent is set by the constructor.
     *
     * @param value
     */
    set childComp(value) {
        this._childComp = value;
    }

    /**
     * useOwnerOnFields == null: when having kids the owner is used otherwise is not used
     * useOwnerOnFields != null: useOwnerOnFields is used to decide whether to use the owner or not
     *
     * @param parentState
     * @param [useOwnerOnFields] {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        // do nothing
    }

    /**
     * Double purpose method:
     * 1. parentState != null: extract the child state from parentState
     * 2. parentState == null: extract the child state from this.parentComp.state.currentState
     *
     * @param [parentState]
     * @return {*} the child state extracted from the parent
     */
    extractChildState(parentState) {
        return undefined;
    }

    detachChild() {
        ArrayUtils.removeElements(this.parentComp.compositeBehaviour.childComponents, this._childComp);
    }
}