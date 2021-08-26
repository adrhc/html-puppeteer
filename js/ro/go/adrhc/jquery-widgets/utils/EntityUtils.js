class EntityUtils {
    static lastGeneratedId = -9999.99;

    static idsAreEqual(id1, id2) {
        if (id1 == null && id2 == null) {
            return true;
        }
        if (EntityUtils.isTransientId(id1) && EntityUtils.isTransientId(id2)) {
            return true;
        }
        return `${id1}` === `${id2}`;
    }

    static haveSameId(item1, item2) {
        if (item1 == null || item2 == null) {
            return false;
        }
        return EntityUtils.idsAreEqual(item1.id, item2.id);
    }

    /**
     * @return {number}
     */
    static generateId() {
        return EntityUtils.lastGeneratedId--;
    }

    static isIdGenerated(id) {
        return !EntityUtils.isInvalidId(id) && +id < 0;
    }

    static removeInvalidId(object) {
        if (EntityUtils.isInvalidId(object.id)) {
            if (object.id != null) {
                object.id = undefined;
            }
        }
        return object;
    }

    static removeGeneratedOrInvalidId(object) {
        if (EntityUtils.isIdGenerated(object.id) || EntityUtils.isInvalidId(object.id)) {
            object.id = undefined;
        }
        return object;
    }

    /**
     * "invalid" means "not numeric"
     *
     * @param id
     * @return {boolean}
     */
    static isInvalidId(id) {
        return !$.isNumeric(id);
    }

    static hasInvalidId(item) {
        return EntityUtils.isInvalidId(item.id);
    }

    static isTransientId(id) {
        return id === IdentifiableEntity.TRANSIENT_ID;
    }

    /**
     * @param item {IdentifiableEntity}
     * @param items {Array<IdentifiableEntity>}
     * @return {number} item index
     */
    static findAndReplaceById(item, items) {
        return ArrayUtils.findAndReplaceByFilter(item, items,
            (it) => EntityUtils.haveSameId(it, item));
    }

    /**
     * @param item {IdentifiableEntity}
     * @param items {Array<IdentifiableEntity>}
     * @return {number}
     */
    static findIndex(item, items) {
        return items.findIndex((it) => EntityUtils.haveSameId(it, item));
    }

    static findIndexById(id, items) {
        return items.findIndex((it) => EntityUtils.idsAreEqual(it.id, id));
    }

    /**
     * @param id {number|string}
     * @param items {Array<IdentifiableEntity>}
     * @return {IdentifiableEntity}
     */
    static findById(id, items) {
        return items.find((it) => EntityUtils.idsAreEqual(it.id, id));
    }

    /**
     * @param id {number|string}
     * @param items {Array<IdentifiableEntity>}
     * @return {IdentifiableEntity} removed entity
     */
    static removeById(id, items) {
        return ArrayUtils.removeFirstByFilter(items,
            (it) => EntityUtils.idsAreEqual(it.id, id))
    }
}