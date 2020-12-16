class StateChange {
    /**
     * the request type that determine the change of state
     */
    requestType;
    /**
     * the data resulted-after/involved-while executing the requestType
     */
    data;

    /**
     * @param requestType {string|undefined} is the request type performed on state (e.g. CREATE, SELECT, NO_OP, etc)
     * @param data {*} is the change-affected state; could be the entire state or part of it
     */
    constructor(requestType, data) {
        this.requestType = requestType;
        this.data = data;
    }
}