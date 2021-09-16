/**
 * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
 * @return {jQuery<HTMLElement>}
 */
export function jQueryOf(elemIdOrJQuery) {
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
export function dataOf(elemIdOrJQuery) {
    if (elemIdOrJQuery == null) {
        return undefined;
    }
    return jQueryOf(elemIdOrJQuery).data();
}

/**
 * Evaluation order: tmplHtml then tmplId.
 *
 * @param {string} tmplId
 * @param {string} tmplHtml
 * @return {Object<string, string>}
 */
export function dataOfTemplateOrHtml(tmplId, tmplHtml) {
    const html = tmplHtml ?? HtmlUtils.templateTextOf(tmplId);
    return html ? dataOf($(html)) : undefined;
}

/**
 * @param {jQueryOf<HTMLElement>} $elem
 * @return {undefined|*}
 */
export function htmlIncludingSelfOf($elem) {
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
export function appendNamespaceTo(events, namespace) {
    if ($.isArray(events)) {
        return events.map(ev => appendNamespaceTo(ev, namespace)).join(" ");
    } else {
        return `${events}${namespace}`;
    }
}
