class HtmlUtils {
    templateTextOf(tmplId) {
        return $(`#${tmplId}`)[0].content.textContent;
    }
}