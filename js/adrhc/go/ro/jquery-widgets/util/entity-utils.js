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

    removeTransient(items) {
        if (!items || !items.length) {
            return false;
        }
        let count = 0;
        while (EntityUtils.prototype.removeById(EntityUtils.prototype.transientId, items)) {
            count++;
        }
        return count;
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
     * @return {boolean}
     */
    findAndReplaceById(item, items) {
        return ArrayUtils.prototype.findAndReplaceByFilter(item, items,
            (it) => EntityUtils.prototype.haveSameId(it, item));
    }

    /**
     * @param id {number}
     * @param items {Array<IdentifiableEntity>}
     * @return {IdentifiableEntity}
     */
    findById(id, items) {
        return ArrayUtils.prototype.findFirstByKeyAndNumberValue("id", id, items);
    }

    /**
     * @param id {number|string}
     * @param items {Array<IdentifiableEntity>}
     * @return {boolean}
     */
    removeById(id, items) {
        return ArrayUtils.prototype.removeFirstByFilter(items,
            (it) => EntityUtils.prototype.haveSameId(it, items))
    }

    newIdentifiableEntity() {
        return new IdentifiableEntity(EntityUtils.prototype.transientId);
    }
}