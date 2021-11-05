import ComponentIllustrator from "./ComponentIllustrator.js";
import StateChange from "../state/change/StateChange.js";

/**
 * @template SCT, SCP
 * @extends {PartialStateChangesHandler}
 */
export class SimplePartsIllustrator extends ComponentIllustrator {
    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partReplaced(partStateChange) {
        // do nothing, rely on partChangeOccurred() method
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partChangeOccurred(partStateChange) {
        super.replaced(new StateChange(partStateChange.previousState, partStateChange.newState))
    }
}

/**
 * @param {AbstractComponent} component
 * @return {SimplePartsIllustrator}
 */
export function simplePartsIllustratorOf(component) {
    return new SimplePartsIllustrator({
        componentId: component.id, ...component.config
    });
}