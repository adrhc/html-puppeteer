/**
 * @param {{}} object
 * @return {{}}
 */
export function coalesce(...object) {
    return Object.assign({}, ...object)
}