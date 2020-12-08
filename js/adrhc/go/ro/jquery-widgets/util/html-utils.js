class HtmlUtils {
    templateTextOf(tmplId) {
        const $tmpl = $(`#${tmplId}`);
        if (!$tmpl.length) {
            return undefined;
        }
        if ($tmpl[0].content) {
            return $tmpl[0].content.textContent;
        } else {
            return $tmpl.html();
        }
    }
}