import StateChange from "./StateChange.js";

/**
 * @template SCT, SCP
 */
export default class PartStateChange extends StateChange {
    /**
     * @type {SCT}
     */
    newPart;
    /**
     * @type {string|number}
     */
    newPartName;
    /**
     * @type {SCT}
     */
    previousPart;
    /**
     * @type {string|number}
     */
    previousPartName;

    /**
     * @param {SCP} previousPart
     * @param {SCP} newPart
     * @param {PartName=} previousPartName is the "old" part name, if any; could be empty when is about a "create"
     * @param {PartName=} newPartName is the "new" part name; could be empty when replacing with nothing (aka "delete")
     * @param {SCT} previousCompleteState
     * @param {SCT} newCompleteState
     */
    constructor(previousCompleteState, newCompleteState,
                previousPart, newPart, previousPartName,
                newPartName = newPart != null ? previousPartName : undefined) {
        super(previousCompleteState, newCompleteState);
        this.previousPart = previousPart;
        this.newPart = newPart;
        this.previousPartName = previousPartName;
        this.newPartName = newPartName;
    }
}