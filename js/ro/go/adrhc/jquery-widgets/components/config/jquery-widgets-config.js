class JqueryWidgetsConfig {
    static serverRoot = "";

    /**
     * @param path {string}
     * @return {string}
     */
    static urlOf(path) {
        if (JqueryWidgetsConfig.serverRoot.endsWith("/")) {
            return `${JqueryWidgetsConfig.serverRoot}${path}`;
        } else if (!JqueryWidgetsConfig.serverRoot || !JqueryWidgetsConfig.serverRoot.trim()) {
            return path;
        } else {
            return `${JqueryWidgetsConfig.serverRoot}/${path}`;
        }
    }
}