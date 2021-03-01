class ErrorStateChange extends StateChange {
    /**
     * @type {string}
     */
    failedRequestType;
    /**
     * @type {SimpleError}
     */
    error;

    /**
     * @param failedRequestType {string}
     * @param error {SimpleError}
     * @param data {*}
     */
    constructor(failedRequestType, error, data) {
        super("ERROR", data);
        this.failedRequestType = failedRequestType;
        this.error = error;
    }
}