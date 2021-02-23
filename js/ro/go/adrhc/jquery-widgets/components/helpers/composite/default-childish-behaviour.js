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
     * Extracts the child state from its view then copy it into the parent state.
     * This is the flow for extracting the data from view.
     *
     * entityExtractor._extractInputValues -> compositeBehaviour.copyKidsState -> kid.copyMyState -> kid._childishBehaviour.copyChildState
     *
     * @param parentState {*}
     * @param [useOwnerOnFields] {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        const childEntity = this._childComp.extractEntity(useOwnerOnFields);
        if (!!childEntity && $.isArray(childEntity)) {
            console.error(`${this.constructor.name}.copyChildState: Array is unsupported for childEntity! use DefaultTableChildishBehaviour`);
            throw `${this.constructor.name}.copyChildState: Array is unsupported for childEntity!`;
        }
        if (childEntity == null && parentState == null) {
            console.log(`${this.constructor.name}.copyChildState: both childEntity and parentState are null`);
        } else if (parentState == null) {
            console.error(`${this.constructor.name}.copyChildState: parentState is null`);
            throw `${this.constructor.name}.copyChildState: parentState is null`;
        } else if ($.isArray(parentState)) {
            parentState.push(childEntity);
        } else if (!!this.childStateProperty) {
            parentState[this.childStateProperty] = childEntity;
        } else if (!!childEntity && typeof childEntity === "object") {
            console.log(`${this.constructor.name}.copyChildState: childStateProperty is null`);
            $.extend(true, parentState, childEntity);
        } else {
            console.error(`${this.constructor.name}.copyChildState: childEntity = ${childEntity}`);
            throw `${this.constructor.name}.copyChildState: childEntity is not object! childEntity = ${childEntity}`;
        }
    }

    /**
     * If not null, extract the child state from @param parentState, otherwise from parentComp.state.
     * This is the flow for updating the children view from a parent-StateChange.
     *
     * see also CompositeBehaviour.processStateChangeWithKids
     * todo: cope with @param parentState missing this child state
     *
     * updateViewOnAny -> compositeBehaviour.processStateChangeWithKids -> compositeBehaviour._extractChildState -> childishBehaviour.extractChildState
     *
     * @param parentState {*} available from a parent-StateChange
     * @return {*}
     */
    extractChildState(parentState) {
        // parentState = parentState == null ? this.parentComp.state.currentState : parentState;
        if (!!this.childStateProperty) {
            return parentState[this.childStateProperty];
        } else {
            return $.extend(true, {}, parentState);
        }
    }
}