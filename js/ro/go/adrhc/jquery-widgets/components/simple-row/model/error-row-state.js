class ErrorRowState extends BasicState {
    /**
     * @param errorStateChange {ErrorStateChange}
     * @param [dontRecordEvents] {boolean}
     */
    collectStateChange(errorStateChange, dontRecordEvents) {
        const failedId = errorStateChange.data.id;
        const data = $.extend(true, {
            failedId,
            error: errorStateChange.error,
            failedRequestType: errorStateChange.failedRequestType
        }, errorStateChange.data);
        data.id = `error-row-${failedId}`;
        super.collectStateChange(new StateChange("CREATE", data), dontRecordEvents);
    }
}