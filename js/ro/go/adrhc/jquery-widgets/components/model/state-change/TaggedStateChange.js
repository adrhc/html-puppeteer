/**
 * @template T
 * @extends {StateChange<T>}
 */
class TaggedStateChange extends StateChange {
    /**
     * @type {"CREATE"|"DELETE"|"REPLACE"}
     */
    changeType;

    /**
     * @param {string} changeType
     * @param {T} previousStateOrPart
     * @param {T} stateOrPart
     * @param {string} [partName]
     */
    constructor(changeType, previousStateOrPart, stateOrPart, partName) {
        super(previousStateOrPart, stateOrPart, partName);
        this.changeType = changeType;
    }
}

class CUDTags {
    static CREATE = "CREATE";
    static DELETE = "DELETE";
    static REPLACE = "REPLACE";
}