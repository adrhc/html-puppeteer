/**
 * @template T, P
 * @extends {StateChange<T, P>}
 */
class TaggedStateChange extends StateChange {
    /**
     * @type {"CREATE"|"DELETE"|"REPLACE"}
     */
    changeType;

    /**
     * @param {string} changeType
     * @param {T|P=} previousStateOrPart
     * @param {T|P=} stateOrPart
     * @param {string|number=} previousPartName is the "old" part name, if any; could be empty when is about a "create" (aka "create")
     * @param {string|number=} newPartName is the "new" part name; could be empty when is replacing with nothing (aka "delete")
     */
    constructor(changeType, previousStateOrPart, stateOrPart, previousPartName, newPartName) {
        super(previousStateOrPart, stateOrPart, previousPartName, newPartName);
        this.changeType = changeType;
    }
}

class CUDTags {
    static CREATE = "CREATE";
    static DELETE = "DELETE";
    static REPLACE = "REPLACE";
}