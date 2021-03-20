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
     * @type {function(parentState: *, partName: string): *}
     */
    childEntityGetter;
    /**
     * @type {function(useOwnerOnFields: boolean): *}
     */
    childEntityExtractorFn;

    /**
     * @param {AbstractComponent} parentComp
     * @param {string} [childProperty] is the parent state's property storing the child state
     * @param {function(parentState: *, partName: string): *} [childEntityGetter]
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
    } = {}) {
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
     * entityExtractor._extractInputValues -> compositeBehaviour.updateFromKidsView -> kid.updateParentFromOwnedView -> kid._childishBehaviour.updateParentFromChildView
     *
     * @param {*} parentState
     * @param {boolean} [useOwnerOnFields]
     */
    updateParentFromChildView(parentState, useOwnerOnFields) {
        const extractedChildEntity = this.childEntityExtractorFn(useOwnerOnFields);
        const childEntity = this.childEntityConverter(extractedChildEntity);
        this.childEntitySetter(childEntity, parentState);
    }

    /**
     * This is the flow for updating the children view from a parent-StateChange.
     *
     * see also CompositeBehaviour.processStateChangeWithKids
     *
     * updateViewOnAny -> compositeBehaviour.processStateChangeWithKids -> compositeBehaviour._extractChildState -> childishBehaviour.getChildEntityFrom
     *
     * @param {*} parentStateOrPart available from a parent-StateChange
     * @param {string=} partName
     * @return {*}
     */
    getChildEntityFrom(parentStateOrPart, partName) {
        return this.childEntityGetter(parentStateOrPart, partName);
    }

    /**
     * @param {IdentifiableEntity} childEntity
     * @param {*} parentState
     * @protected
     */
    _setChildIntoParent(childEntity, parentState) {
        if (childEntity == null && parentState == null) {
            // both parent and child are null
            console.log(`${this.constructor.name}._setChildIntoParent: both childEntity and parentState are null`);
        } else if (parentState == null) {
            // error: the parent is null
            console.error(`${this.constructor.name}._setChildIntoParent: parentState is null`);
            throw `${this.constructor.name}._setChildIntoParent: parentState is null`;
        } else if (this.childProperty == null) {
            // error: the property to set is missing
            console.error(`${this.constructor.name}._setChildIntoParent: childProperty is null`);
            throw `${this.constructor.name}._setChildIntoParent: childProperty is null`;
        } else {
            // parentState could be either an Array or an object
            parentState[this.childProperty] = childEntity;
        }
    }

    /**
     * If not null, extract the child state from @param parentState, otherwise from parentComp.state.
     *
     * @param {*} parentState available from a parent-StateChange
     * @param {string=} partName
     * @return {IdentifiableEntity | IdentifiableEntity[]}
     * @protected
     */
    _getChildEntityFrom(parentState, partName) {
        // parentState = parentState == null ? this.parentComp.state.currentState : parentState;
        if (parentState == null) {
            return undefined;
        } else if (this.childProperty != null) {
            if (!partName) {
                return parentState[this.childProperty];
            } else if (partName === this.childProperty) {
                return parentState;
            } else {
                // todo: would it be better to throw some error?
                return undefined;
            }
        } else if ($.isArray(parentState)) {
            return [...parentState];
        } else {
            return $.extend(new IdentifiableEntity(), parentState);
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