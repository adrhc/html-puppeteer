/**
 * The child state is a property in the parent state.
 */
class DefaultChildishBehaviour extends ChildishBehaviour {
    /**
     * @type {string}
     */
    childProperty;

    /**
     * @param parentComp {AbstractComponent}
     * @param [childProperty] {string} is the parent state's property storing the child state
     */
    constructor(parentComp, childProperty) {
        super(parentComp);
        this.childProperty = childProperty;
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
        this._setChildIntoParent(childEntity, parentState);
    }

    /**
     * @param {IdentifiableEntity} childEntity
     * @param {*} parentState
     * @protected
     */
    _setChildIntoParent(childEntity, parentState) {
        if (childEntity != null && $.isArray(childEntity)) {
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
        } else if (this.childProperty != null) {
            parentState[this.childProperty] = childEntity;
        } else if (childEntity != null && typeof childEntity === "object") {
            console.log(`${this.constructor.name}.copyChildState: childProperty is null`);
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
     * updateViewOnAny -> compositeBehaviour.processStateChangeWithKids -> compositeBehaviour._extractChildState -> childishBehaviour.childStateFrom
     *
     * @param parentState {*} available from a parent-StateChange
     * @return {*}
     */
    childStateFrom(parentState) {
        // parentState = parentState == null ? this.parentComp.state.currentState : parentState;
        if (this.childProperty != null) {
            return parentState[this.childProperty];
        } else {
            return $.extend(true, {}, parentState);
        }
    }
}