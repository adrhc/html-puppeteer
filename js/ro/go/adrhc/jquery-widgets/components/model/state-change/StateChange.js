/**
 * @template T
 */
class StateChange {
    /**
     * @type {T}
     */
    stateOrPart;
    /**
     * @type {string}
     */
    partName;
    /**
     * @type {T}
     */
    previousStateOrPart

    /**
     * @param {T|*} previousStateOrPart
     * @param {T|*} [stateOrPart]
     * @param {string} [partName]
     */
    constructor(previousStateOrPart, stateOrPart, partName) {
        this.stateOrPart = stateOrPart;
        this.previousStateOrPart = previousStateOrPart;
        this.partName = partName;
    }
}