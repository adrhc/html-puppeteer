class AbstractTemplatingView extends AbstractView {
    /**
     * @type {CachedHtmlTemplate}
     */
    template;

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
            htmlTmpl = this.$elem.html();
            this.template = new CachedHtmlTemplate({htmlTmpl});
        }
    }

    /**
     * @param {StateChange} stateChange
     * @return {Promise<StateChange>}
     */
    update(stateChange) {
        return this._updateImpl(stateChange.stateOrPart).then(() => stateChange);
    }

    /**
     * @param {Object} stateOrPart
     * @return {Promise<jQuery>}
     * @protected
     */
    _updateImpl(stateOrPart) {
        return this._generateHtml(stateOrPart)
            .then(html => this.$elem.html(html));
    }

    /**
     * @param {Object} data
     * @return {Promise<string>}
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