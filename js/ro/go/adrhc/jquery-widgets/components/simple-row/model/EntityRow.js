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
     * @type {number|string}
     */
    beforeRowId;
    /**
     * @type {number|string}
     */
    afterRowId;

    /**
     * @param {IdentifiableEntity} entity
     * @param {number=} index at which to create the row (useful only when creating the row otherwise the row is matched by id)
     * @param {number|string=} beforeRowId
     * @param {number|string=} afterRowId
     */
    constructor(entity, {index, beforeRowId, afterRowId} = {}) {
        this.entity = entity;
        this.index = index == null && beforeRowId == null && afterRowId == null ? 0 : index;
        this.beforeRowId = beforeRowId;
        this.afterRowId = afterRowId;
    }
}