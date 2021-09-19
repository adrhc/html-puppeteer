import StateChangesHandler from "./StateChangesHandler.js";

/**
 * @template SCT, SCP
 *
 * @interface
 */
export default class PartialStateChangesHandler extends StateChangesHandler {
    /**
     * @param {PartStateChange} partStateChange
     */
    partRemoved(partStateChange) {}

    /**
     * @param {PartStateChange} partStateChange
     */
    partCreated(partStateChange) {}

    /**
     * @param {PartStateChange} partStateChange
     */
    partRelocated(partStateChange) {}

    /**
     * @param {PartStateChange} partStateChange
     */
    partReplaced(partStateChange) {}

    /**
     * @param {PartStateChange} partStateChange
     */
    partChangeOccurred(partStateChange) {}
}