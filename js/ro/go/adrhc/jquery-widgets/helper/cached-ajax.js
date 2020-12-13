class CachedAjax {
    /**
     * @param url {string}
     */
    constructor(url) {
        this._cache = AjaxUtils.prototype.loadHtml(url);
    }

    /**
     * @return {Promise<string>}
     */
    get cache() {
        return this._cache;
    }
}