class CachedAjax {
    /**
     * @param url {Promise<string>}
     */
    constructor(url) {
        this._cache = AjaxUtils.prototype.loadHtml(url);
    }

    /**
     * @return {*}
     */
    get cache() {
        return this._cache;
    }
}