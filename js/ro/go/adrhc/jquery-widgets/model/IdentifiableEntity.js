class IdentifiableEntity {
    static TRANSIENT_ID = "newId";

    /**
     * @param [id] {number|string}
     */
    constructor(id) {
        this.id = id;
    }

    static of(data) {
        if (data == null) {
            return undefined;
        }
        return _.defaults(new IdentifiableEntity(), data);
    }
}