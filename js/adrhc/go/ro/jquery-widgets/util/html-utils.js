class HtmlUtils {
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
}