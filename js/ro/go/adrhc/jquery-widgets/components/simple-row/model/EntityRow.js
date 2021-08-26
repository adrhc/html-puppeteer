class EntityRow {
    static POSITIONING_PROPERTIES = ["index", "beforeRowId", "afterRowId", "append"];

    /**
     * @type {IdentifiableEntity}
     */
    entity;
    /**
     * @type {number|undefined} where to put the new entity or to move the previous, existing, one
     */
    index;
    /**
     * @type {number|string|undefined}
     */
    beforeRowId;
    /**
     * @type {number|string|undefined}
     */
    afterRowId;
    /**
     * @type {boolean|undefined}
     */
    append;

    /**
     * "index" is the position at which to create the row; useful
     * only when creating a row otherwise the row is matched by id.
     *
     * @param {IdentifiableEntity} entity
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} options
     */
    constructor(entity, options = {}) {
        EntityRow.POSITIONING_PROPERTIES.forEach(it => this[it] = options[it]);
        this.entity = entity;
    }

    /**
     * @param {{}} source
     * @return {{}}
     */
    static areAllPositioningPropertiesEmpty(source = {}) {
        return !EntityRow.POSITIONING_PROPERTIES.find(p => source[p] != null);
    }
}