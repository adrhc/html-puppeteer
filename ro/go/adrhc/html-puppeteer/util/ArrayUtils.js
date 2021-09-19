/**
 * @param {[]} array
 * @param {*} value
 * @return {[]}
 */
export function pushNotNull(array, ...value) {
    value.filter(v => v != null).forEach(v => array.push(v));
    return array;
}

/**
 * @param {[]} array
 * @param {*} item
 * @param {number} index
 */
export function insert(array, item, index) {
    if (array.length === index) {
        array.push(item);
    } else {
        array.splice(index, 0, item);
    }
}

/**
 * @param {[]} array
 * @param {number} index
 */
export function removeByIndex(array, index) {
    array.splice(index, 1);
}
