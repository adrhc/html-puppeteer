/**
 * @template SCT, SCP
 *
 * @interface
 */
export default class StateChangesHandler {
    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    created(stateChange) {}

    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    replaced(stateChange) {}

    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    removed(stateChange) {}

    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    changeOccurred(stateChange) {}
}