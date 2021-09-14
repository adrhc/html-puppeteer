/**
 * @template SCT, SCP
 */
export default class StateChangeEnhancer {
    /**
     * @param {StateChange<SCT, SCP>} stateChange
     * @return {StateChange<SCT, SCP>}
     */
    enhance(stateChange) {
        return stateChange;
    }
}