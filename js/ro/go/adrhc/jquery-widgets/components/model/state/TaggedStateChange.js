class TaggedStateChange extends StateChange {
    /**
     * @type {"CREATE"|"DELETE"|"REPLACE"}
     */
    changeType;

    /**
     * @param {string} changeType
     * @param {*} previousStateOrPart
     * @param {*} stateOrPart
     * @param {string} [partName]
     */
    constructor(changeType, previousStateOrPart, stateOrPart, partName) {
        super(previousStateOrPart, stateOrPart, partName);
        this.changeType = changeType;
    }
}