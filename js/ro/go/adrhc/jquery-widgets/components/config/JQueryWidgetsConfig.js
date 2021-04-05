class JQueryWidgetsConfig {
    static SERVER_ROOT = "";
    static ALERT_ON_FAILED_ASSERTION = false;
    static OWNER_ATTRIBUTE = "owner";

    /**
     * @param path {string}
     * @return {string}
     */
    static urlOf(path) {
        if (JQueryWidgetsConfig.SERVER_ROOT.endsWith("/")) {
            return `${JQueryWidgetsConfig.SERVER_ROOT}${path}`;
        } else if (!JQueryWidgetsConfig.SERVER_ROOT || !JQueryWidgetsConfig.SERVER_ROOT.trim()) {
            return path;
        } else {
            return `${JQueryWidgetsConfig.SERVER_ROOT}/${path}`;
        }
    }
}