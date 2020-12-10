class EntityFormUtils {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param owner {string}
     * @return {{}}
     */
    extractEntityFrom($elem, owner) {
        const item = FormUtils.prototype.objectifyInputsOf($elem, owner);
        EntityUtils.prototype.removeTransientId(item);
        return item;
    }
}