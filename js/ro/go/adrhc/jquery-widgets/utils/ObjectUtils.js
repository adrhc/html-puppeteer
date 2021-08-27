class ObjectUtils {
    /**
     * @param {{}} target
     * @param {{}} source
     * @return {{}}
     */
    static copyDeclaredProperties(target, source) {
        if (!source) {
            return target;
        }
        Object.keys(target).forEach(k => target[k] = source[k]);
        return target;
    }
}