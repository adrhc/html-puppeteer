class StateChange {
    operation;
    state;

    /**
     * @param operation is the operation performed on state
     * @param state is the change-affected state; could be the entire state or part of it
     */
    constructor(operation, state) {
        this.operation = operation;
        this.state = state;
    }
}