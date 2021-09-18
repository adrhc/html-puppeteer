/**
 * @param {Bag} target
 * @param {*} value
 * @param {string} propertyName
 */
export function setOwnProperty(target, value, propertyName) {
    if (!value) {
        return;
    }
    if (target.hasOwnProperty(propertyName)) {
        target[propertyName] = value;
    }
}
