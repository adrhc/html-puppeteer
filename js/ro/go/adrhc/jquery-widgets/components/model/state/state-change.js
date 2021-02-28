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
     * @type {*}
     */
    previousStateOrPart

    /**
     * @param {"CREATE"|"DELETE"|"REPLACE"} changeType specify the state change type
     * @param {*} previousStateOrPart
     * @param {*} stateOrPart
     * @param {string} [partName]
     */
    constructor(changeType, previousStateOrPart, stateOrPart, partName) {
        this.changeType = changeType;
        this.stateOrPart = stateOrPart;
        this.previousStateOrPart = previousStateOrPart;
        this.partName = partName;
    }
}