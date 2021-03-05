class StateChange {
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
     * @param {*} previousStateOrPart
     * @param {*} [stateOrPart]
     * @param {string} [partName]
     */
    constructor(previousStateOrPart, stateOrPart, partName) {
        this.stateOrPart = stateOrPart;
        this.previousStateOrPart = previousStateOrPart;
        this.partName = partName;
    }
}