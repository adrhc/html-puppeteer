class ComponentUtil {
    static configOf(elemIdOrJQuery) {
        return _.defaults(new ComponentConfiguration(), DomUtils.dataOf(elemIdOrJQuery));
    }
}