class ArrayUtils {
    /**
     * @param item {IdentifiableEntity}
     * @param items {Array<IdentifiableEntity>}
     * @param filter
     * @return {boolean}
     */
    findAndReplaceByFilter(item, items, filter) {
        const index = items.findIndex(filter);
        if (index < 0) {
            return false;
        }
        items.splice(index, 1, item);
        return true;
    }

    /**
     * @param keyName {string}
     * @param keyValue {number}
     * @param items {Array<{}>}
     * @return {{}}
     */
    findFirstByKeyAndNumberValue(keyName, keyValue, items) {
        return items.find(it => +it[keyName] === +keyValue);
    }

    /**
     * @param items {Array<{}>}
     * @param filter
     * @return {boolean}
     */
    removeFirstByFilter(items, filter) {
        const index = items.findIndex(filter);
        return items.splice(index, 1) > 0;
    }
}