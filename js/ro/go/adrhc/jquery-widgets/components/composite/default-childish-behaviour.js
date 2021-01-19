/**
 * The child state is a property in the parent state.
 */
class DefaultChildishBehaviour extends ChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param childStateProperty {string} is the parent state's property storing the child state
     */
    constructor(parentComp, childStateProperty) {
        super(parentComp);
        this.childStateProperty = childStateProperty;
    }

    /**
     * @param parentState {Person}
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        parentState[this.childStateProperty] = this._childComp.extractEntity(useOwnerOnFields);
    }

    extractChildState(parentState) {
        parentState = parentState ? parentState : this.parentComp.state.currentState;
        return parentState[this.childStateProperty];
    }
}