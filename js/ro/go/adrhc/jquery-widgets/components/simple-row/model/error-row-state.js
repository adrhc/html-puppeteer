class ErrorRowState extends BasicState {
    /**
     * @param errorStateChange {ErrorStateChange}
     * @param [dontRecordEvents] {boolean}
     */
    collectErrorStateChange(errorStateChange, dontRecordEvents) {
        let failedId = errorStateChange.data.id;
        failedId = !!failedId ? failedId : EntityUtils.transientId;
        const data = $.extend(true, {
            failedId,
            error: errorStateChange.error,
            failedRequestType: errorStateChange.failedRequestType
        }, errorStateChange.data);
        data.id = `error-row-${failedId}`;
        super.collectStateChange(new PositionStateChange("CREATE", data, undefined, failedId), dontRecordEvents);
    }
}