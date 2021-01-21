class CachedUrls {
    /**
     * structure: {urlName1: urlName1Text, urlName2: urlName2Text}
     *
     * @type {Promise<{}>}
     */
    namedUrls;

    /**
     * @param namedUrls {NamedUrl}
     */
    constructor(...namedUrls) {
        const promises = namedUrls.map(nu =>
            AjaxUtils.loadText(nu.url).then(text => {
                nu.text = text;
                return nu;
            }));
        this.namedUrls = Promise.allSettled(promises).then(namedUrls =>
            Converters.objectFromKeyValues(namedUrls.map(it => it.value), "name", "text"));
    }
}