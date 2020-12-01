class MustacheUtils {
    renderTmplId(data, tmplId) {
        const tmplHtml = $(`#${tmplId}`).html();
        return  Mustache.render(tmplHtml, data)
    }
}