class HtmlUtils {
    /**
     * @param tmplId is the template html-element id
     * @return {string} the template's html extracted from template html-element id (i.e. tmplId)
     */
    templateTextOf(tmplId) {
        const $tmpl = $(`#${tmplId}`);
        if (!$tmpl.length) {
            return undefined;
        }
        if ($tmpl[0].content) {
            // use <template> when content encoding as HTML is not an issue
            return $tmpl.html();
        } else {
            // use <script> when don't wont the HTML encoding to be automatically applied
            return $tmpl.text();
        }
    }

    /**
     * @param tmplId is the template html-element id
     * @param tmplHtml is the template's html
     * @return {string} the template's html extracted from template html-element id or tmplHtml if null tmplId
     */
    templateOf(tmplId, tmplHtml) {
        if (tmplId) {
            return HtmlUtils.prototype.templateTextOf(tmplId);
        } else if (tmplHtml) {
            return tmplHtml;
        }
    }
}