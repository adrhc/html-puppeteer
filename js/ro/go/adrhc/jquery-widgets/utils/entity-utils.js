class EntityUtils {
    static lastGeneratedId = -9999.99;

    static get transientId() {
        return "newId";
    }

    static idsAreEqual(id1, id2) {
        if (EntityUtils.isTransientId(id1) && EntityUtils.isTransientId(id2)) {
            return true;
        }
        return +id1 === +id2;
    }

    static haveSameId(item1, item2) {
        if (!item1 || !item2 || !item1.id || !item2.id) {
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

    static removeGeneratedIds(array) {
        array.forEach(it => EntityUtils.removeGeneratedId(it));
        return array;
    }

    static removeGeneratedId(object) {
        if (EntityUtils.isIdGenerated(object.id)) {
            if (object.id != null) {
                object.id = undefined;
            }
        }
        return object;
    }

    /**
     * @param items {Array<IdentifiableEntity>}
     * @return {IdentifiableEntity|IdentifiableEntity[]} removed entities
     */
    static removeTransient(items) {
        let removedEntities = [];
        if (!items || !items.length) {
            return removedEntities;
        }
        let lastRemovedEntity;
        do {
            lastRemovedEntity = EntityUtils.removeById(EntityUtils.transientId, items);
            if (lastRemovedEntity) {
                removedEntities.push(lastRemovedEntity);
            }
        } while (lastRemovedEntity)
        return removedEntities.length === 1 ? removedEntities[0] : removedEntities;
    }

    static removeGeneratedOrInvalidId(object) {
        if (EntityUtils.isIdGenerated(object.id) || EntityUtils.isInvalidId(object.id)) {
            if (object.id != null) {
                object.id = undefined;
            }
        }
        return object;
    }

    static removeTransientId(object) {
        if (EntityUtils.isTransient(object)) {
            if (object.id != null) {
                object.id = undefined;
            }
        }
        return object;
    }

    static isInvalidId(id) {
        return !$.isNumeric(id);
    }

    static hasInvalidId(item) {
        return EntityUtils.isInvalidId(item.id);
    }

    static isTransientId(id) {
        return id === EntityUtils.transientId;
    }

    static isTransient(item) {
        return item.id === EntityUtils.transientId;
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
        return ArrayUtils.findFirstByKeyAndNumberValue("id", id, items);
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

    /**
     * @param [id] {number|string}
     * @return {IdentifiableEntity}
     */
    static newIdentifiableEntity(id) {
        return new IdentifiableEntity(!!id ? id : EntityUtils.transientId);
    }
}