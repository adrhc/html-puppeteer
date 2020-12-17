class EntityFormUtils {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param owner {string}
     * @return {{}}
     */
    extractEntityFrom($elem, owner) {
        const item = FormUtils.prototype.objectifyInputsOf($elem, owner);
        return EntityUtils.prototype.removeTransientId(item);
    }
}