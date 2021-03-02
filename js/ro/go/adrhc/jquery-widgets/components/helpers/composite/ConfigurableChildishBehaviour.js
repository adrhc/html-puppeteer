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
     * @param [childProperty] {string} is the parent state's property storing the child state
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter]
     * @param {function(childEntity: IdentifiableEntity, parentState: *): void} [childSetter]
     * @param {function(parentState: *): *} [childGetter]
     * @param {function(useOwnerOnFields: boolean): *} [childRawDataExtractor]
     */
    constructor(parentComp, childProperty, {
        childEntityConverter = (it) => it,
        childSetter,
        childGetter,
        childRawDataExtractor
    }) {
        super(parentComp, childProperty);
        this.childSetter = childSetter ? childSetter : super._setChildIntoParent.bind(this);
        this.childGetter = childGetter ? childGetter : super.childStateFrom.bind(this);
        this.childRawDataExtractor = childRawDataExtractor ? childRawDataExtractor : this._childComp.extractEntity.bind(this);
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