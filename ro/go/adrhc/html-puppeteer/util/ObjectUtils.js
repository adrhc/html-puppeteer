/**
 * @param {{}} object
 * @return {{}}
 */
export function coalesce(...object) {
    return Object.assign({}, ...object)
}

/**
 * @param {{}} target
 * @param {*} object
 * @param {string} propertyName
 * @protected
 */
export function injectOwnProperty(target, object, propertyName) {
    if (!object) {
        return;
    }
    if (target.hasOwnProperty(propertyName)) {
        target[propertyName] = object;
    }
}
