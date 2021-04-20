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
        if (!$elem || !$elem.length) {
            return undefined;
        }
        return $elem.prop('outerHTML');
    }

    /**
     * @param {string,string[]} events
     * @param {string} namespace
     * @return {string}
     */
    static appendNamespaceTo(events, namespace) {
        if ($.isArray(events)) {
            return events.map(ev => DomUtils.appendNamespaceTo(ev, namespace)).join(" ");
        } else {
            return `${events}${namespace}`;
        }
    }
}