class ElasticListEntityExtractor extends DefaultEntityExtractor {
    constructor(component, {dontRemoveGeneratedId, entityConverterFn = (it) => it}) {
        super(component, {dontRemoveGeneratedId, entityConverterFn});
    }

    extractAllEntities(useOwnerOnFields) {
        return this.component
            .compositeBehaviour.extractAllEntities(useOwnerOnFields)
            .map(e => this.entityConverterFn(e));
    }
}