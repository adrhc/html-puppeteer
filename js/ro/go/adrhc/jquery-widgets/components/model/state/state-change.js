class StateChange {
    /**
     * @type {"CREATE"|"DELETE"|"REPLACE"}
     */
    changeType;
    /**
     * @type {*}
     */
    stateOrPart;
    /**
     * @type {string}
     */
    partName;

    /**
     * @param {"CREATE"|"DELETE"|"REPLACE"} changeType specify the state change type
     * @param {*} stateOrPart
     * @param {string} [partName]
     */
    constructor(changeType, stateOrPart, partName) {
        this.changeType = changeType;
        this.stateOrPart = stateOrPart;
        this.partName = partName;
    }
}