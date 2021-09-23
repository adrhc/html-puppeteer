import SimpleTemplateView, {simpleTemplateViewProvider} from "../view/SimpleTemplateView.js";
import ComponentIllustrator from "./ComponentIllustrator.js";
import StateChange from "../state/change/StateChange.js";
import {withViewProvider} from "../component/options/ComponentOptionsBuilder.js";

/**
 * @typedef {ComponentIllustratorOptions} SimplePartsIllustratorOptions
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimplePartsIllustrator extends ComponentIllustrator {
    /**
     * @param {SimplePartsIllustratorOptions} options
     */
    constructor(options) {
        super(withViewProvider(options.viewProviderFn ?? simpleTemplateViewProvider).to(options));
    }

    /**
     * @param {SimpleViewOptions} viewConfig
     * @return {SimpleTemplateView}
     * @protected
     */
    _createView(viewConfig) {
        return new SimpleTemplateView(viewConfig);
    }

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