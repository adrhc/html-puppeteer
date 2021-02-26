class StateChange {
    /**
     * @param {string} changeType specify the state change type
     * @param {*} [partialOrEntireState]
     * @param {string} [partName]
     */
    constructor(changeType, partialOrEntireState, partName) {
        this.requestType = changeType;
        this.data = partialOrEntireState;
        this.partName = partName;
    }
}