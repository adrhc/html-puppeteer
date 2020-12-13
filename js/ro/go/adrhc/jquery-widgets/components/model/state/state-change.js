class StateChange {
    requestType;
    state;

    /**
     * @param requestType {string|undefined} is the request type performed on state (e.g. CREATE, SELECT, NO_OP, etc)
     * @param state {*} is the change-affected state; could be the entire state or part of it
     */
    constructor(requestType, state) {
        this.requestType = requestType;
        this.state = state;
    }
}