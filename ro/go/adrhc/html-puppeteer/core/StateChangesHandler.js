/**
 * @abstract
 */
export default class StateChangesHandler {
    /**
     * @param {StateChange} stateChange
     */
    created(stateChange) {}

    /**
     * @param {StateChange} stateChange
     */
    replaced(stateChange) {}

    /**
     * @param {StateChange} stateChange
     */
    removed(stateChange) {}

    /**
     * @param {StateChange} stateChange
     */
    changeOccurred(stateChange) {}
}