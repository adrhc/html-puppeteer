import StateChange from "./StateChange.js";

/**
 * @template SCT, SCP
 * @extends {StateChange<SCT, SCP>}
 */
export default class TypedStateChange extends StateChange {
    /**
     * @type {string}
     */
    changeType;

    /**
     * @param {string} changeType
     * @param {SCT|SCP=} previousStateOrPart
     * @param {SCT|SCP=} stateOrPart
     * @param {string|number=} previousPartName is the "old" part name, if any; could be empty when is about a "create" (aka "create")
     * @param {string|number=} newPartName is the "new" part name; could be empty when is replacing with nothing (aka "delete")
     */
    constructor(changeType, previousStateOrPart, stateOrPart, previousPartName, newPartName) {
        super(previousStateOrPart, stateOrPart, previousPartName, newPartName);
        this.changeType = changeType;
    }
}

export class CUDTypes {
    static CREATED = "created";
    static DELETED = "deleted";
    static RELOCATED = "relocated";
    static REPLACED = "replaced";
}