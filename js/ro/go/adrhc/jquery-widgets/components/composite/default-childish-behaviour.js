/**
 * The child state is a property in the parent state.
 */
class DefaultChildishBehaviour extends ChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param [childStateProperty] {string} is the parent state's property storing the child state
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
        const childEntity = this._childComp.extractEntity(useOwnerOnFields);
        if (!!this.childStateProperty) {
            parentState[this.childStateProperty] = childEntity;
        } else {
            $.extend(true, parentState, childEntity);
        }
    }

    extractChildState(parentState) {
        parentState = parentState ? parentState : this.parentComp.state.currentState;
        if (!!this.childStateProperty) {
            return parentState[this.childStateProperty];
        } else {
            return $.extend(true, {}, parentState);
        }
    }
}