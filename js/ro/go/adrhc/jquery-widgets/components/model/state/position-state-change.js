class PositionStateChange extends StateChange {
    /**
     * @param requestType {string} is the request type performed on state (e.g. CREATE, SELECT, NO_OP, etc)
     * @param [data] {*} is the change-affected state; could be the entire state or part of it
     * @param [afterItemId] {number|string}
     * @param [beforeItemId] {number|string}
     * @param [partName] {string}
     */
    constructor(requestType, data, {partName, afterItemId, beforeItemId}) {
        super(requestType, data, partName);
        this.afterItemId = afterItemId
        this.beforeItemId = beforeItemId
    }
}