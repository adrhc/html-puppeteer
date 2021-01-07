class ArrayUtils {
    /**
     * @param item
     * @param array {Array<IdentifiableEntity>}
     * @param filter
     * @return {number} item index
     */
    static findAndReplaceByFilter(item, array, filter) {
        const index = array.findIndex(filter);
        if (index >= 0) {
            array.splice(index, 1, item);
        }
        return index;
    }

    /**
     * @param keyName {string}
     * @param keyValue {number|string}
     * @param array {Array<{}>}
     * @return {{}}
     */
    static findFirstByKeyAndNumberValue(keyName, keyValue, array) {
        return array.find(it => it[keyName] == keyValue);
    }

    /**
     * @param array {Array<{}>}
     * @param filter {function(value: *, index: number, obj: []): boolean}
     * @return removed item
     */
    static removeFirstByFilter(array, filter) {
        const index = array.findIndex(filter);
        if (index < 0) {
            return undefined;
        }
        const itemToRemove = array[index];
        array.splice(index, 1);
        return itemToRemove;
    }

    /**
     * @param array {Array}
     * @param elements {Array}
     */
    static removeElements(array, elements) {
        elements.forEach(el => array.splice(array.indexOf(el), 1))
    }

    /**
     * @param item
     * @param index {number}
     * @param array {Array}
     */
    static insert(item, index, array) {
        array.splice(index, 0, item);
    }
}