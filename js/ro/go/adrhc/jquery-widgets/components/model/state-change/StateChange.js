/**
 * @template T
 */
class StateChange {
    /**
     * @type {T}
     */
    previousStateOrPart
    /**
     * @type {T}
     */
    stateOrPart;
    /**
     * @type {string}
     */
    partName;

    /**
     * @param {T} previousStateOrPart
     * @param {T} [stateOrPart]
     * @param {string} [partName]
     */
    constructor(previousStateOrPart, stateOrPart, partName) {
        this.stateOrPart = stateOrPart;
        this.previousStateOrPart = previousStateOrPart;
        this.partName = partName;
    }
}