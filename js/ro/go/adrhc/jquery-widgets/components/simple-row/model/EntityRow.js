class EntityRow {
    /**
     * @type {IdentifiableEntity}
     */
    entity;
    /**
     * @type {number}
     */
    index;

    /**
     * @param {IdentifiableEntity} entity
     * @param {number} [index]
     */
    constructor(entity, index = 0) {
        this.entity = entity;
        this.index = index;
    }
}