class DomUtils {
    /**
     * @param elemIdOrJQuery {string}
     * @return {jQuery<HTMLElement>}
     */
    static jQueryOf(elemIdOrJQuery) {
        if (elemIdOrJQuery instanceof jQuery) {
            return elemIdOrJQuery;
        } else {
            return $(`#${elemIdOrJQuery}`);
        }
    }
}