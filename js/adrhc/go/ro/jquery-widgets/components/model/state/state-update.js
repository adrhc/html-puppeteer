class StateUpdate extends StateChange {
    /**
     * @param state is the change-affected state; could be the entire state or part of it
     */
    constructor(state) {
        super("UPDATE", state);
    }
}