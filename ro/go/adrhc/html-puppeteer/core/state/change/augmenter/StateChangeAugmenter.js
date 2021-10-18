/**
 * @template SCT, SCP
 */
export default class StateChangeAugmenter {
    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @return {PartStateChange<SCT, SCP>}
     */
    augment(partStateChange) {
        return partStateChange;
    }
}