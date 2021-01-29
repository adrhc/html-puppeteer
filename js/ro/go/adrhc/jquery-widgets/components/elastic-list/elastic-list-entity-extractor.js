class ElasticListEntityExtractor extends DefaultEntityExtractor {
    extractAllEntities(useOwnerOnFields) {
        return this.component.compositeBehaviour.extractAllEntities(useOwnerOnFields);
    }
}