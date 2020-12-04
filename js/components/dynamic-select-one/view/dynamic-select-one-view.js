class DynamicSelectOneView {
    constructor(elemId, tmplId, placeholder) {
        this.elemId = elemId;
        this.tmplId = tmplId;
        this.placeholder = placeholder;
    }

    init(data) {
        const tmplHtml = $(`#${this.tmplId}`).html();
        const html = Mustache.render(tmplHtml, $.extend(true, {placeholder: this.placeholder}, data))
        $(`#${this.elemId}`).html(html.trim());
    }
}