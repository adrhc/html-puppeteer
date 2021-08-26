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
     * @param elements
     */
    static removeElements(array, ...elements) {
        elements.forEach(el => array.splice(array.indexOf(el), 1))
    }

    static removeByIndex(index, array) {
        array.splice(index, 1);
    }

    /**
     * @param item
     * @param index {number}
     * @param array {Array}
     */
    static insert(item, index, array) {
        if (array.length === index) {
            array.push(item);
            return;
        }
        array.splice(index, 0, item);
    }
}