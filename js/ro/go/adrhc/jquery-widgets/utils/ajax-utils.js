class AjaxUtils {
    /**
     * @param url {String}
     * @return {Promise<string>}
     */

    /*
        loadHtml(url) {
            return $.ajax({url: url, dataType: html});
        }
    */

    /**
     * @param url {string}
     * @return {Promise<string>}
     */
    loadHtml(url) {
        return fetch(url).then((response) => response.text());
    }
}