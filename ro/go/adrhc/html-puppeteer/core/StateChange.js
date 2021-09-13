/**
 * @template T, P
 */
export default class StateChange {
    /**
     * @type {string|number}
     */
    newPartName;
    /**
     * @type {T|P}
     */
    newStateOrPart;
    /**
     * @type {string|number}
     */
    previousPartName;
    /**
     * @type {T|P}
     */
    previousStateOrPart

    /**
     * previousPartName and newPartName could be the same (this in fact should be the usual case)
     *
     * @param {T|P=} previousStateOrPart
     * @param {T|P=} newStateOrPart
     * @param {string|number=} previousPartName is the "old" part name, if any; could be empty when is about a "create"
     * @param {string|number=} newPartName is the "new" part name; could be empty when replacing with nothing (aka "delete"); by default keeping the previous part name if the new one is not provided and newStateOrPart is not empty
     */
    constructor(previousStateOrPart, newStateOrPart, previousPartName,
                newPartName = newStateOrPart != null ? previousPartName : undefined) {
        this.newStateOrPart = newStateOrPart;
        this.previousStateOrPart = previousStateOrPart;
        this.previousPartName = previousPartName;
        this.newPartName = newPartName;
    }
}