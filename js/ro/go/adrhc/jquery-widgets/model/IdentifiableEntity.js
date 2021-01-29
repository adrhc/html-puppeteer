class IdentifiableEntity {
    static TRANSIENT_ID = "newId";

    /**
     * @param [id] {number|string}
     */
    constructor(id) {
        this.id = id;
    }

    static entityConverter(data) {
        if (data == null) {
            return undefined;
        }
        return $.extend(true, new IdentifiableEntity(), data);
    }
}