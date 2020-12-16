class StateUpdate extends StateChange {
    /**
     * @param data is the change-affected state; could be the entire state or part of it
     */
    constructor(data) {
        super("UPDATE", data);
    }
}