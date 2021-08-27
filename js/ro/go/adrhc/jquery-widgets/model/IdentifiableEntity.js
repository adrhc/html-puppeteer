/**
 * @template E
 */
class IdentifiableEntity {
    static TRANSIENT_ID = "newId";

    /**
     * @param {number|string} [id]
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * @param {E} entityValues
     * @return {undefined|*}
     */
    static of(entityValues) {
        if (entityValues == null) {
            // todo: use new IdentifiableEntity()
            return undefined;
        }
        return _.defaults(new IdentifiableEntity(), entityValues);
    }
}