/**
 * @template SCT, SCP
 */
export default class StateChange {
    /**
     * @type {string}
     */
    changeType;
    /**
     * @type {string|number}
     */
    newPartName;
    /**
     * @type {SCT|SCP}
     */
    newStateOrPart;
    /**
     * @type {string|number}
     */
    previousPartName;
    /**
     * @type {SCT|SCP}
     */
    previousStateOrPart

    /**
     * previousPartName and newPartName could be the same (this in fact should be the usual case)
     *
     * @param {SCT|SCP=} previousStateOrPart
     * @param {SCT|SCP=} newStateOrPart
     * @param {PartName=} previousPartName is the "old" part name, if any; could be empty when is about a "create"
     * @param {PartName=} newPartName is the "new" part name; could be empty when replacing with nothing (aka "delete"); by default keeping the previous part name if the new one is not provided and newStateOrPart is not empty
     */
    constructor(previousStateOrPart, newStateOrPart, previousPartName,
                newPartName = newStateOrPart != null ? previousPartName : undefined) {
        this.newStateOrPart = newStateOrPart;
        this.previousStateOrPart = previousStateOrPart;
        this.previousPartName = previousPartName;
        this.newPartName = newPartName;
    }
}