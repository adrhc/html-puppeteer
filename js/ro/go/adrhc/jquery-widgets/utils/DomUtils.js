class DomUtils {
    /**
     * @param {String|jQuery<HTMLElement>} elemIdOrJQuery
     * @return {jQuery<HTMLElement>}
     */
    static jQueryOf(elemIdOrJQuery) {
        if (elemIdOrJQuery instanceof jQuery) {
            return elemIdOrJQuery;
        } else {
            return $(`#${elemIdOrJQuery}`);
        }
    }

    /**
     * @param {String|jQuery<HTMLElement>} elemIdOrJQuery
     * @return {Object.<string, string>}
     */
    static dataOf(elemIdOrJQuery) {
        if (elemIdOrJQuery == null) {
            return undefined;
        }
        return DomUtils.jQueryOf(elemIdOrJQuery).data();
    }

    static htmlIncludingSelfOf($elem) {
        return $elem.prop('outerHTML');
    }
}