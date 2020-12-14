class ArrayUtils {
    /**
     * @param item
     * @param items {Array<IdentifiableEntity>}
     * @param filter
     * @return {number} item index
     */
    findAndReplaceByFilter(item, items, filter) {
        const index = items.findIndex(filter);
        if (index >= 0) {
            items.splice(index, 1, item);
        }
        return index;
    }

    /**
     * @param keyName {string}
     * @param keyValue {number|string}
     * @param items {Array<{}>}
     * @return {{}}
     */
    findFirstByKeyAndNumberValue(keyName, keyValue, items) {
        return items.find(it => it[keyName] == keyValue);
    }

    /**
     * @param items {Array<{}>}
     * @param filter
     * @return {number} removed index
     */
    removeFirstByFilter(items, filter) {
        const index = items.findIndex(filter);
        if (index < 0) {
            return index;
        }
        items.splice(index, 1);
        return index;
    }

    /**
     * @param item
     * @param index {number}
     * @param items {Array}
     */
    insert(item, index, items) {
        items.splice(index, 0, item);
    }
}