class JqueryWidgetsConfig {
    static SERVER_ROOT = "";

    /**
     * @param path {string}
     * @return {string}
     */
    static urlOf(path) {
        if (JqueryWidgetsConfig.SERVER_ROOT.endsWith("/")) {
            return `${JqueryWidgetsConfig.SERVER_ROOT}${path}`;
        } else if (!JqueryWidgetsConfig.SERVER_ROOT || !JqueryWidgetsConfig.SERVER_ROOT.trim()) {
            return path;
        } else {
            return `${JqueryWidgetsConfig.SERVER_ROOT}/${path}`;
        }
    }
}