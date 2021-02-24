class AbstractTemplatingView extends AbstractView {
    /**
     * @param {string} [tmplUrl]
     * @param {string} [tmplId]
     * @param {string} [htmlTmpl]
     * @protected
     */
    _setupCachedHtmlTemplate({tmplUrl, tmplId, htmlTmpl}) {
        if (tmplUrl) {
            this.template = new CachedHtmlTemplate({url: tmplUrl});
        } else if (htmlTmpl) {
            this.template = new CachedHtmlTemplate({htmlTmpl});
        } else if (tmplId) {
            htmlTmpl = HtmlUtils.templateTextOf(tmplId);
            this.template = new CachedHtmlTemplate({htmlTmpl});
        } else {
            console.warn(`${this.constructor.name}._setupCachedHtmlTemplate: tmplUrl, htmlTmplId, htmlTmpl are all empty; this.template is not set!`);
        }
    }

    /**
     * @param {StateChange} stateChange
     * @return {Promise<StateChange>}
     */
    update(stateChange) {
        return this._generateHtml(stateChange.data)
            .then(html => this.$elem.html(html))
            .then(() => stateChange);
    }

    /**
     * @param {{}} data
     * @return {Promise<void>}
     * @protected
     */
    _generateHtml(data) {
        // return data ? Mustache.render(rowTmplHtml, data) : rowTmplHtml;
        if (data) {
            return this.template.cached.then((htmlTmpl) => {
                const template = Handlebars.compile(htmlTmpl);
                return template(data);
            })
        } else {
            return this.template.cached;
        }
    }
}