/**
 * @template SCT
 */
export default class StateChange {
    /**
     * @type {string}
     */
    changeType;
    /**
     * @type {SCT}
     */
    newState;
    /**
     * @type {SCT}
     */
    previousState

    /**
     * previousPartName and newPartName could be the same (this in fact should be the usual case)
     *
     * @param {SCT=} previousStateOrPart
     * @param {SCT=} newStateOrPart
     */
    constructor(previousStateOrPart, newStateOrPart) {
        this.previousState = previousStateOrPart;
        this.newState = newStateOrPart;
    }
}