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
     */
    copyChildState(parentState, useOwnerOnFields) {
        const childEntity = this._childComp.extractEntity(useOwnerOnFields);
        if (!!this.childStateProperty) {
            parentState[this.childStateProperty] = childEntity;
        } else if (childEntity == null) {
            console.log(`${this.constructor.name}.copyChildState: childStateProperty and childEntity are both null`);
        } else if ($.isArray(childEntity)) {
            console.log(`${this.constructor.name}.copyChildState: childStateProperty is null`);
            if (!$.isArray(parentState)) {
                console.log(`${this.constructor.name}.copyChildState: childEntity is Array while parentState is not!`);
                throw `${this.constructor.name}.copyChildState`;
            } else {
                parentState.length = 0;
                parentState.push(...childEntity);
            }
        } else {
            console.log(`${this.constructor.name}.copyChildState: childStateProperty is null`);
            if ($.isArray(parentState)) {
                console.log(`${this.constructor.name}.copyChildState: parentState is Array while childEntity is not!`);
                throw `${this.constructor.name}.copyChildState`;
            } else {
                $.extend(true, parentState, childEntity);
            }
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