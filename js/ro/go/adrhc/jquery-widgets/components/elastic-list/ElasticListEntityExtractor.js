class ElasticListEntityExtractor extends DefaultEntityExtractor {
    /**
     * @param {AbstractComponent} component
     * @param {boolean=} dontRemoveGeneratedId
     * @param {function(entity: IdentifiableEntity): IdentifiableEntity} [entityConverterFn]
     */
    constructor(component, {
        dontRemoveGeneratedId,
        entityConverterFn = it => it
    } = {
        entityConverterFn(it) {
            return it;
        }
    }) {
        super(component, {dontRemoveGeneratedId, entityConverterFn});
    }

    /**
     * @param {boolean=} useOwnerOnFields
     * @return {IdentifiableEntity[]}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.component
            .compositeBehaviour.extractAllEntities(useOwnerOnFields)
            .map(e => this.entityConverterFn(e));
    }
}