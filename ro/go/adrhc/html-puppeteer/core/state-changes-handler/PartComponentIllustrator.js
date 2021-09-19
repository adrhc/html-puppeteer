import ComponentIllustrator from "./ComponentIllustrator.js";
import StateChange from "../state/change/StateChange.js";

/**
 * @implements {PartialStateChangesHandler}
 * @extends {ComponentIllustrator}
 */
export default class PartComponentIllustrator extends ComponentIllustrator {
    /**
     * @param {PartStateChange} partStateChange
     */
    partRemoved(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange} partStateChange
     */
    partCreated(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange} partStateChange
     */
    partRelocated(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange} partStateChange
     */
    partReplaced(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange} partStateChange
     */
    partChangeOccurred(partStateChange) {
        super.replaced(new StateChange(partStateChange.oldState, partStateChange.newState))
    }
}