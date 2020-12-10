class EntityUtils {
    get transientId() {
        return "newId";
    }

    haveSameId(item1, item2) {
        if (!item1 || !item2 || !item1.id || !item2.id) {
            return false;
        }
        return +item1.id === +item2.id;
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
}