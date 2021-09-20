import StateChangesHandler from "./StateChangesHandler.js";

/**
 * This should be treated like an interface with default implementations.
 *
 * @template SCT, SCP
 *
 * @extends {StateChangesHandler}
 * @abstract
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