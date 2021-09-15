/**
 * @param {[]} array
 * @param {*} value
 * @return {[]}
 */
export function pushNotNull(array, ...value) {
    value.filter(v => v != null).forEach(v => array.push(v));
    return array;
}