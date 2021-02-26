class SimpleRowState extends BasicState {
    /**
     * @param rowState {*}
     */
    constructor(rowState) {
        super();
        this.currentState = rowState;
    }

    /**
     * @param updatedRowState {*}
     * @param [requestType] {"CREATE"|"DELETE"|"UPDATE"}
     * @param [afterItemId] {number|string}
     * @param [dontRecordStateEvents] {boolean}
     */
    update(updatedRowState, requestType = "UPDATE", afterItemId, dontRecordStateEvents) {
        this.replace(updatedRowState, dontRecordStateEvents);
    }

    get rowState() {
        return this.currentState;
    }

    set rowState(rowState) {
        this.currentState = rowState;
    }
}