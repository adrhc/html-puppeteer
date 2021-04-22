class ObjectUtils {
    /**
     * @param {Object} object
     * @param {string} properties
     * @return {Object}
     */
    static propertiesOf(object, ...properties) {
        const result = {};
        properties.forEach(p => result[p] = object[p]);
        return result;
    }
}