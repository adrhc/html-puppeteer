/**
 * The child state is a property in the parent state.
 */
class DefaultChildishBehaviour extends ChildishBehaviour {
    /**
     * @type {string}
     */
    childProperty;
    /**
     * Used to convert the child's state into the parent's property.
     *
     * todo: remove childEntityConverter
     *
     * This capability overlaps with DefaultEntityExtractor.entityConverterFn
     * but is needed by DynamicSelectOneComponent which is not completely
     * updated to use AbstractComponent.
     *
     * @type {function(rawData: *): IdentifiableEntity}
     */
    childEntityConverter;
    /**
     * @type {function(childEntity: IdentifiableEntity, parentState: *): void} childEntitySetter
     */
    childEntitySetter;
    /**
     * @type {function(parentState: *): *}
     */
    childEntityGetter;
    /**
     * @type {function(useOwnerOnFields: boolean): *}
     */
    childEntityExtractorFn;

    /**
     * @param {AbstractComponent} parentComp
     * @param {string} [childProperty] is the parent state's property storing the child state
     * @param {function(parentState: *): *} [childEntityGetter]
     * @param {function(childEntity: IdentifiableEntity, parentState: *): void} [childEntitySetter]
     * @param {function(useOwnerOnFields: boolean): *} [childEntityExtractorFn] extracts raw data from the HTML component's representation
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter] converts extracted raw data to IdentifiableEntity
     */
    constructor(parentComp, {
        childProperty,
        childEntityGetter,
        childEntitySetter,
        childEntityExtractorFn,
        childEntityConverter = (it) => it,
    }) {
        super(parentComp);
        this.childProperty = childProperty;
        this.childEntityGetter = childEntityGetter ? childEntityGetter : this._getChildEntityFrom.bind(this);
        this.childEntitySetter = childEntitySetter ? childEntitySetter : this._setChildIntoParent.bind(this);
        this.childEntityExtractorFn = childEntityExtractorFn ? childEntityExtractorFn : this._extractChildEntity.bind(this);
        this.childEntityConverter = childEntityConverter;
    }

    /**
     * Extracts the child state from its view then copy it into the parent state.
     * This is the flow for extracting the data from view.
     *
     * entityExtractor._extractInputValues -> compositeBehaviour.updateParentFromKidsView -> kid.updateParentFromOwnedView -> kid._childishBehaviour.updateParentFromChildView
     *
     * @param {*} parentState
     * @param {boolean} [useOwnerOnFields]
     */
    updateParentFromChildView(parentState, useOwnerOnFields) {
        const rawChildData = this.childEntityExtractorFn(useOwnerOnFields);
        const childEntity = this.childEntityConverter(rawChildData);
        this.childEntitySetter(childEntity, parentState);
    }

    /**
     * This is the flow for updating the children view from a parent-StateChange.
     *
     * see also CompositeBehaviour.processStateChangeWithKids
     * todo: cope with @param parentState missing this child state
     *
     * updateViewOnAny -> compositeBehaviour.processStateChangeWithKids -> compositeBehaviour._extractChildState -> childishBehaviour.getChildEntityFrom
     *
     * @param {*} parentState available from a parent-StateChange
     * @return {*}
     */
    getChildEntityFrom(parentState) {
        return this.childEntityGetter(parentState);
    }

    /**
     * @param {IdentifiableEntity} childEntity
     * @param {*} parentState
     * @protected
     */
    _setChildIntoParent(childEntity, parentState) {
        if (childEntity != null && $.isArray(childEntity)) {
            console.error(`${this.constructor.name}.updateParentFromChildView: Array is unsupported for childEntity! use DefaultTableChildishBehaviour`);
            throw `${this.constructor.name}.updateParentFromChildView: Array is unsupported for childEntity!`;
        }
        if (childEntity == null && parentState == null) {
            console.log(`${this.constructor.name}.updateParentFromChildView: both childEntity and parentState are null`);
        } else if (parentState == null) {
            console.error(`${this.constructor.name}.updateParentFromChildView: parentState is null`);
            throw `${this.constructor.name}.updateParentFromChildView: parentState is null`;
        } else if ($.isArray(parentState)) {
            parentState.push(childEntity);
        } else if (this.childProperty != null) {
            parentState[this.childProperty] = childEntity;
        } else if (childEntity != null && typeof childEntity === "object") {
            console.log(`${this.constructor.name}.updateParentFromChildView: childProperty is null`);
            $.extend(true, parentState, childEntity);
        } else {
            console.error(`${this.constructor.name}.updateParentFromChildView: childEntity = ${childEntity}`);
            throw `${this.constructor.name}.updateParentFromChildView: childEntity is not object! childEntity = ${childEntity}`;
        }
    }

    /**
     * If not null, extract the child state from @param parentState, otherwise from parentComp.state.
     *
     * @param {*} parentState available from a parent-StateChange
     * @return {*}
     * @protected
     */
    _getChildEntityFrom(parentState) {
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
    _extractChildEntity(useOwnerOnFields) {
        return this._childComp.extractEntity(useOwnerOnFields);
    }
}