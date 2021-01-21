class CachedUrl {
    /**
     * @param url {string}
     */
    constructor(url) {
        this._cache = AjaxUtils.loadText(url);
    }

    /**
     * @return {Promise<string>}
     */
    get cache() {
        return this._cache;
    }
}