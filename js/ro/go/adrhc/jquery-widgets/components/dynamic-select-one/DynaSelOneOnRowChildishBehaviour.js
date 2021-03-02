class DynaSelOneOnRowChildishBehaviour extends DynaSelOneChildishBehaviour {
    /**
     * @param {AbstractComponent} parentComp
     * @param {string} childProperty is the parentState property where to save the selectedItem
     * @param {function(rawData: *): IdentifiableEntity} [childEntityConverter] converts extracted raw data to IdentifiableEntity
     */
    constructor(parentComp, childProperty, childEntityConverter) {
        super(parentComp, {
            childProperty,
            childGetter: (rowValues) => rowValues.values[childProperty],
            childSetter: (childEntity, parentState) => parentState[childProperty] = childEntity,
            childEntityConverter
        });
    }
}