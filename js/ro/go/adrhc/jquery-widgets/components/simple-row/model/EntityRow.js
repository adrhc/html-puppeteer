/**
 * @template E
 */
class EntityRow {
    /**
     * @type {IdentifiableEntity<E>}
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
     * @param {IdentifiableEntity<E>} entity
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: boolean}} [positioningProperties]
     */
    constructor(entity, positioningProperties) {
        PositionUtils.copyPositioningProperties(positioningProperties, this);
        this.entity = entity;
    }
}