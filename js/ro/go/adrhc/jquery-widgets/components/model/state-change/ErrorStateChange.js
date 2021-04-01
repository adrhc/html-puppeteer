class ErrorStateChange extends CreateStateChange {
    static TAG = "ERROR";

    /**
     * @param {*} errorData
     * @param {string=} changeType
     */
    constructor(errorData, changeType = ErrorStateChange.TAG) {
        super(changeType, undefined, errorData);
    }
}