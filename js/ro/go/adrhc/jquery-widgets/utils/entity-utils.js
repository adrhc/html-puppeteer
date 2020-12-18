class EntityUtils {
    get transientId() {
        return "newId";
    }

    idsAreEqual(id1, id2) {
        if (EntityUtils.prototype.isTransientId(id1) && EntityUtils.prototype.isTransientId(id2)) {
            return true;
        }
        return +id1 === +id2;
    }

    haveSameId(item1, item2) {
        if (!item1 || !item2 || !item1.id || !item2.id) {
            return false;
        }
        return EntityUtils.prototype.idsAreEqual(item1.id, item2.id);
    }

    /**
     * @return {number}
     */
    generateId() {
        return -1 - Math.random();
    }

    isIdGenerated(id) {
        return !this.isEmptyId(id) && +id < 0;
    }

    removeGeneratedIds(array) {
        array.forEach(it => EntityUtils.prototype.removeGeneratedId(it));
        return array;
    }

    removeGeneratedId(object) {
        if (EntityUtils.prototype.isIdGenerated(object.id)) {
            delete object.id;
        }
        return object;
    }

    /**
     * @param items {Array<IdentifiableEntity>}
     * @return {IdentifiableEntity|IdentifiableEntity[]} removed entities
     */
    removeTransient(items) {
        let removedEntities = [];
        if (!items || !items.length) {
            return removedEntities;
        }
        let lastRemovedEntity;
        do {
            lastRemovedEntity = EntityUtils.prototype.removeById(EntityUtils.prototype.transientId, items);
            if (lastRemovedEntity) {
                removedEntities.push(lastRemovedEntity);
            }
        } while (lastRemovedEntity)
        return removedEntities.length === 1 ? removedEntities[0] : removedEntities;
    }

    removeTransientId(object) {
        if (EntityUtils.prototype.isTransient(object)) {
            delete object.id;
        }
        return object;
    }

    isEmptyId(id) {
        return !$.isNumeric(id);
    }

    hasEmptyId(item) {
        return this.isEmptyId(item.id);
    }

    isTransientId(id) {
        return id === this.transientId;
    }

    isTransient(item) {
        return item.id === this.transientId;
    }

    /**
     * @param item {IdentifiableEntity}
     * @param items {Array<IdentifiableEntity>}
     * @return {number} item index
     */
    findAndReplaceById(item, items) {
        return ArrayUtils.prototype.findAndReplaceByFilter(item, items,
            (it) => EntityUtils.prototype.haveSameId(it, item));
    }

    /**
     * @param item {IdentifiableEntity}
     * @param items {Array<IdentifiableEntity>}
     * @return {number}
     */
    findIndex(item, items) {
        return items.findIndex((it) => EntityUtils.prototype.haveSameId(it, item));
    }

    findIndexById(id, items) {
        return items.findIndex((it) => EntityUtils.prototype.idsAreEqual(it.id, id));
    }

    /**
     * @param id {number|string}
     * @param items {Array<IdentifiableEntity>}
     * @return {IdentifiableEntity}
     */
    findById(id, items) {
        return ArrayUtils.prototype.findFirstByKeyAndNumberValue("id", id, items);
    }

    /**
     * @param id {number|string}
     * @param items {Array<IdentifiableEntity>}
     * @return {IdentifiableEntity} removed entity
     */
    removeById(id, items) {
        return ArrayUtils.prototype.removeFirstByFilter(items,
            (it) => EntityUtils.prototype.idsAreEqual(it.id, id))
    }

    /**
     * @param id {number|string|undefined}
     * @return {IdentifiableEntity}
     */
    newIdentifiableEntity(id) {
        return new IdentifiableEntity(!!id ? id : EntityUtils.prototype.transientId);
    }
}