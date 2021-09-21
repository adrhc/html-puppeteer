/**
 * @template SCT, SCP
 */
export default class StateChange {
    /**
     * @type {string}
     */
    changeType;
    /**
     * @type {SCT|SCP}
     */
    newState;
    /**
     * @type {SCT|SCP}
     */
    previousState

    /**
     * previousPartName and newPartName could be the same (this in fact should be the usual case)
     *
     * @param {SCT|SCP=} previousStateOrPart
     * @param {SCT|SCP=} newStateOrPart
     */
    constructor(previousStateOrPart, newStateOrPart) {
        this.previousState = previousStateOrPart;
        this.newState = newStateOrPart;
    }
}