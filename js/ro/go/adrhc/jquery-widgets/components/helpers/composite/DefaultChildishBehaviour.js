/**
 * The child state is a property in the parent state.
 */
class DefaultChildishBehaviour extends ChildishBehaviour {
    /**
     * @type {string}
     */
    childProperty;
    /**
     * used to convert the child's state into the parent's property
     *
     * @type {function(rawData: *): IdentifiableEntity}
     */
    childEntityConverter;
    /**
     * @type {function(childEntity: IdentifiableEntity, parentState: *): void} childSetter
     */
    childSetter;
    /**
     * @type {function(parentState: *): *}
     */
    childGetter;
    /**
     * @type {function(useOwnerOnFields: boolean): *}
     */
    childRawDataExtractor;

    /**
     * @param {AbstractComponent} parentComp
     * @param {string} [childProperty] is the parent state's property storing the child state
     * @param {function(parentState: *): *} [childGetter]
     * @param {function(childEntity: IdentifiableEntity, parentState: *): void} [childSetter]
     * @param {function(useOwnerOnFields: boolean): *} [childRawDataExtractor] extracts raw data from the HTML component's representation
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter] converts extracted raw data to IdentifiableEntity
     */
    constructor(parentComp, {
        childProperty,
        childGetter,
        childSetter,
        childRawDataExtractor,
        childEntityConverter = (it) => it,
    }) {
        super(parentComp);
        this.childProperty = childProperty;
        this.childGetter = childGetter ? childGetter : this._childStateFrom.bind(this);
        this.childSetter = childSetter ? childSetter : this._setChildIntoParent.bind(this);
        this.childRawDataExtractor = childRawDataExtractor ? childRawDataExtractor : this._extractChildRawData.bind(this);
        this.childEntityConverter = childEntityConverter;
    }

    /**
     * Extracts the child state from its view then copy it into the parent state.
     * This is the flow for extracting the data from view.
     *
     * entityExtractor._extractInputValues -> compositeBehaviour.copyKidsState -> kid.copyMyState -> kid._childishBehaviour.copyChildState
     *
     * @param {*} parentState
     * @param {boolean} [useOwnerOnFields]
     */
    copyChildState(parentState, useOwnerOnFields) {
        const rawChildData = this.childRawDataExtractor(useOwnerOnFields);
        const childEntity = this.childEntityConverter(rawChildData);
        this.childSetter(childEntity, parentState);
    }

    /**
     * This is the flow for updating the children view from a parent-StateChange.
     *
     * see also CompositeBehaviour.processStateChangeWithKids
     * todo: cope with @param parentState missing this child state
     *
     * updateViewOnAny -> compositeBehaviour.processStateChangeWithKids -> compositeBehaviour._extractChildState -> childishBehaviour.childStateFrom
     *
     * @param {*} parentState available from a parent-StateChange
     * @return {*}
     */
    childStateFrom(parentState) {
        return this.childGetter(parentState);
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
     *
     * @param {*} parentState available from a parent-StateChange
     * @return {*}
     * @protected
     */
    _childStateFrom(parentState) {
        // parentState = parentState == null ? this.parentComp.state.currentState : parentState;
        if (this.childProperty != null) {
            return parentState[this.childProperty];
        } else {
            return $.extend(true, {}, parentState);
        }
    }

    /**
     * @param {boolean} useOwnerOnFields
     * @return {IdentifiableEntity}
     * @protected
     */
    _extractChildRawData(useOwnerOnFields) {
        return this._childComp.extractEntity(useOwnerOnFields);
    }
}