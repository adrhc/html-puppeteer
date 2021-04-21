class CachedHtmlTemplate {
    /**
     * @param {string} [url]
     * @param {string} [htmlTmpl]
     */
    constructor({url, htmlTmpl}) {
        if (url) {
            this._cache = AjaxUtils.loadText(url);
        } else {
            this._cache = Promise.resolve(htmlTmpl);
        }
    }

    /**
     * @return {Promise<string>}
     */
    get cached() {
        return this._cache;
    }
}