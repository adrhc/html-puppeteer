class ObjectUtils {
    static objectWithPropertiesOf(object, ...properties) {
        const result = {};
        properties.forEach(p => result[p] = object[p]);
        return result;
    }
}