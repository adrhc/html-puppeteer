import StateChangesHandler from "./StateChangesHandler.js";

/**
 * @template SCT, SCP
 *
 * @extends {StateChangesHandler}
 * @interface
 */
export default class PartialStateChangesHandler extends StateChangesHandler {
    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {}

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {}

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {}

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partReplaced(partStateChange) {}

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partChangeOccurred(partStateChange) {}
}