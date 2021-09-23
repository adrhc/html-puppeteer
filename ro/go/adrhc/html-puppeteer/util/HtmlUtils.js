/**
 * @param {string} tmplId is the template html-element id
 * @return {string} the template's html extracted from template html-element id (i.e. tmplId)
 */
export function templateTextOf(tmplId) {
    if (!tmplId) {
        return undefined;
    }
    const $tmpl = $(`#${tmplId}`);
    if (!$tmpl.length) {
        return undefined;
    }
    if ($tmpl[0].content) {
        // use <template> when content encoding as HTML is not an issue
        return $tmpl.html().trim();
    } else {
        // use <script> when don't wont the HTML encoding to be automatically applied
        return $tmpl.text().trim();
    }
}

/**
 * @param {string} tmplId is the template html-element id
 * @param {string} tmplHtml is the template's html
 * @return {string} the template's html extracted from template html-element id or tmplHtml if null tmplId
 */
export function templateOf(tmplId, tmplHtml) {
    if (tmplId) {
        return HtmlUtils.templateTextOf(tmplId);
    } else if (tmplHtml) {
        return tmplHtml;
    }
}

/**
 * @param {jQuery<HTMLElement>} $elem
 */
export function focus($elem) {
    const value = $elem.val();
    $elem.focus().val("").val(value);
}

export function encodeHTML(s) {
    return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;').split("'").join('&#39;');
}

/**
 * @param {Object} object
 * @return {string}
 */
export function dataAttributesOf(object) {
    return Object.entries(object).map(([key, value]) => `data-${_.kebabCase(key)}="${encodeHTML(value)}"`).join(" ");
}