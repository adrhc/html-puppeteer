class DynaSelOneOnRowChildishBehaviour extends DynaSelOneChildishBehaviour {
    /**
     * @param {AbstractComponent} parentComp
     * @param {string} childProperty is the parentState property where to save the selectedItem
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter] converts extracted raw data to IdentifiableEntity
     */
    constructor(parentComp, childProperty, childEntityConverter) {
        super(parentComp, {
            childProperty,
            childEntityGetter: (rowValues) => rowValues.values[childProperty],
            childEntitySetter: (childEntity, parentState) => parentState[childProperty] = childEntity,
            childEntityConverter
        });
    }
}