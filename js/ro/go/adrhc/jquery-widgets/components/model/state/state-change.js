class StateChange {
    /**
     * @param requestType {string} is the request type performed on state (e.g. CREATE, SELECT, NO_OP, etc)
     * @param [data] {*} is the change-affected state; could be the entire state or part of it
     */
    constructor(requestType, data) {
        this.requestType = requestType;
        this.data = data;
    }
}