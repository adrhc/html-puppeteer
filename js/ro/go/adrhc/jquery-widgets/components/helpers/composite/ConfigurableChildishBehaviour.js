class ConfigurableChildishBehaviour extends DefaultChildishBehaviour {
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
     * @param parentComp {AbstractComponent}
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
        super(parentComp, childProperty);
        this.childGetter = childGetter ? childGetter : super.childStateFrom.bind(this);
        this.childSetter = childSetter ? childSetter : super._setChildIntoParent.bind(this);
        this.childRawDataExtractor = childRawDataExtractor ? childRawDataExtractor : this._childComp.extractEntity.bind(this);
        this.childEntityConverter = childEntityConverter;
    }

    copyChildState(parentState, useOwnerOnFields) {
        const rawChildData = this.childRawDataExtractor(useOwnerOnFields);
        const childEntity = this.childEntityConverter(rawChildData);
        this.childSetter(childEntity, parentState);
    }

    childStateFrom(parentState) {
        return this.childGetter(parentState);
    }
}