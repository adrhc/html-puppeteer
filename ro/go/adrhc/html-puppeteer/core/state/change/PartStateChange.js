import StateChange from "./StateChange.js";

/**
 * @template SCT, SCP
 */
export default class PartStateChange extends StateChange {
    /**
     * @type {SCT}
     */
    newState;
    /**
     * @type {SCT}
     */
    oldState;

    /**
     *
     * @param {SCP} previousPart
     * @param {SCP} newPart
     * @param {PartName=} previousPartName
     * @param {PartName=} newPartName
     * @param {SCT} oldState
     * @param {SCT} newState
     */
    constructor(previousPart, newPart, previousPartName,
                newPartName, oldState, newState) {
        super(previousPart, newPart, previousPartName, newPartName);
        this.oldState = oldState;
        this.newState = newState;
    }
}