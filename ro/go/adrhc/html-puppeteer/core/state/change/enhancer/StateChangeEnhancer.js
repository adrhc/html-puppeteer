/**
 * @template SCT, SCP
 */
export default class StateChangeEnhancer {
    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @return {PartStateChange<SCT, SCP>}
     */
    enhance(partStateChange) {
        return partStateChange;
    }
}