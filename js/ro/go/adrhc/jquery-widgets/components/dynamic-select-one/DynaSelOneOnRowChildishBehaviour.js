class DynaSelOneOnRowChildishBehaviour extends DynaSelOneChildishBehaviour {
    /**
     * @param {AbstractComponent} parentComp
     * @param {string} childProperty is the parentState property where to save the selectedItem
     * @param {function(rawData: *): IdentifiableEntity} [toEntityConverter] converts extracted raw data to IdentifiableEntity
     */
    constructor(parentComp, childProperty, toEntityConverter) {
        super(parentComp, {
            childProperty,
            childEntityGetter: (rowValues) => rowValues.entity[childProperty],
            childEntitySetter: (childEntity, parentState) => parentState[childProperty] = childEntity,
            toEntityConverter
        });
    }
}