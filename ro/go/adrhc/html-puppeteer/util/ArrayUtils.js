/**
 * @param {[]} array
 * @param {*} values
 * @return {[]}
 */
import {isTrue} from "./AssertionUtils.js";

export function pushNotNull(array, ...values) {
    values.filter(v => v != null).forEach(v => array.push(v));
    return array;
}

/**
 * @param {[]} array
 * @param {*} values
 * @return {[]}
 */
export function pushNotNullMissing(array, ...values) {
    values.filter(v => v != null && array.indexOf(v) === -1).forEach(v => array.push(v));
    return array;
}

/**
 * If array[index] is "null" than update to "item" otherwise insert or append, resizing the array if necessary.
 *
 * @param {[]} array
 * @param {*} item
 * @param {number} [index=0]
 */
export function updateOrInsert(array, item, index = 0) {
    isTrue(item != null,
        `[insert] item is null!\nthis creates confusion because Array.resize also creates nulls`);
    // convert to number (Object.entries gives string indexes even for Array)
    index = +index;
    if (array.length === index) {
        array.push(item);
    } else if (index > array.length) {
        resize(array, index);
        array.push(item);
    } else if (array[index] == null) {
        // this is a null array entry created on a resize
        array[index] = item;
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

/**
 * @param {[]} array
 * @param {number} size
 */
export function resize(array, size) {
    while (array.length < size) {
        array.push(null);
    }
}