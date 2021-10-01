import {encodeHTML} from "./StringUtils.js";
import {componentIdOf, idAttrOf} from "./GlobalConfig.js";

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

/**
 * @return {string} total height of "this" DOM element
 */
export function getTotalHeight() {
    return this.scrollHeight + "px";
}

/**
 * @param {Object} object
 * @return {string}
 */
export function dataAttributesOf(object) {
    if (object == null) {
        return "";
    }
    return Object.entries(object)
        .filter(([key, value]) => typeof key === "string" &&
            (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean"))
        .map(([key, value]) => `data-${_.kebabCase(key)}="${encodeHTML(value)}"`).join(" ");
}

/**
 * @param {HTMLElement|jQueryOf<HTMLElement>} el
 * @return {{}}
 */
export function attrsOf(el) {
    if (el instanceof jQuery) {
        el = el[0];
    }
    return el.getAttributeNames()
        .reduce((obj, name) => ({
            ...obj,
            [name]: el.getAttribute(name)
        }), {});
}

(function ($) {
    $.fn.attrs = function () {
        return attrsOf($(this)[0]);
    }
})(jQuery);

/**
 * @param {jQuery<HTMLElement>} $elem
 */
export function focus($elem) {
    const value = $elem.val();
    $elem.focus().val("").val(value);
}

/**
 * @param {string} templateId
 * @return {string|undefined}
 */
export function templateOfTemplateId(templateId) {
    return templateOf({templateId});
}

/**
 * @param {jQuery<HTMLElement>} $elem
 * @return {string|undefined}
 */
export function templateOf$Elem($elem) {
    return templateOf({$elem});
}

/**
 * @param {string=} htmlTemplate is the template's html
 * @param {string=} templateId is the template html-element id
 * @param {jQuery<HTMLElement>=} $elem
 * @return {string|undefined} the template's html extracted from template html-element id or htmlTemplate if null templateId
 */
export function templateOf({htmlTemplate, templateId, $elem}) {
    if (htmlTemplate != null) {
        return htmlTemplate;
    } else if (templateId) {
        return contentOfElem(jQueryOf(templateId));
    } else {
        return contentOfElem($elem);
    }
}

/**
 * @param {jQuery<HTMLElement>} $elem
 * @return {string|undefined}
 */
function contentOfElem($elem) {
    if (!$elem?.length) {
        return undefined;
    }
    if ($elem[0] instanceof HTMLScriptElement) {
        // <script id="..." type="text/x-handlebars-template">
        return $elem.text().trim();
    } else {
        // use when content encoding as HTML is not an issue
        return $elem.html().trim();
    }
}

/**
 * @param {string|jQuery<HTMLElement>=} elemIdOrJQuery
 */
export function idOf(elemIdOrJQuery) {
    const $el = jQueryOf(elemIdOrJQuery);
    return idAttrOf($el) ?? componentIdOf($el);
}
