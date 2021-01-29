/**
 * @abstract
 */
class EntityExtractor {
    static EXTRACT_ENTITY_UNSUPPORTED = "EntityExtractor.extractEntity: unsupported operation!";
    static EXTRACT_ENTITIES_UNSUPPORTED = "EntityExtractor.extractAllEntities: unsupported operation!";

    /**
     * When having kids and useOwnerOnFields is null than the owner is used despite
     * of the useOwnerOnFields value; otherwise the useOwnerOnFields value is used.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {IdentifiableEntity} the entity managed by the component when managing only 1 entity
     */
    extractEntity(useOwnerOnFields) {
        throw `${this.constructor.name}.extractEntity: method not implemented!`;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used despite
     * of the useOwnerOnFields value otherwise the useOwnerOnFields value is used.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {IdentifiableEntity[]} the entities managed by the component (could be only 1 entity)
     */
    extractAllEntities(useOwnerOnFields) {
        throw `${this.constructor.name}.extractAllEntities: method not implemented!`;
    }
}