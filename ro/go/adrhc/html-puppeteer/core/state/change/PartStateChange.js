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
     * @param {SCT|SCP} previousStateOrPart
     * @param {SCT|SCP} newStateOrPart
     * @param {PartName=} previousPartName
     * @param {PartName=} newPartName
     * @param {SCT} oldState
     * @param {SCT} newState
     */
    constructor(previousStateOrPart, newStateOrPart, previousPartName,
                newPartName, oldState, newState) {
        super(previousStateOrPart, newStateOrPart, previousPartName, newPartName);
        this.oldState = oldState;
        this.newState = newState;
    }
}