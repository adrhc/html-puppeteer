class AjaxUtils {
    /**
     * @param url {string}
     * @return {Promise<string>}
     */

    /*
        loadText(url) {
            return $.ajax({url: url, dataType: html});
        }
    */

    /**
     * @param url {string}
     * @return {Promise<string>}
     */
    static loadText(url) {
        return fetch(url).then((response) => response.text());
    }
}