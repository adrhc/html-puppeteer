class DomUtils {
    /**
     * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
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
     * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
     * @return {Object.<string, string>}
     */
    static dataOf(elemIdOrJQuery) {
        if (elemIdOrJQuery == null) {
            return undefined;
        }
        return DomUtils.jQueryOf(elemIdOrJQuery).data();
    }

    /**
     * Evaluation order: tmplHtml then tmplId.
     *
     * @param {string} tmplId
     * @param {string} tmplHtml
     * @return {Object<string, string>}
     */
    static dataOfTemplateOrHtml(tmplId, tmplHtml) {
        const html = tmplHtml ?? HtmlUtils.templateTextOf(tmplId);
        return html ? DomUtils.dataOf($(html)) : undefined;
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