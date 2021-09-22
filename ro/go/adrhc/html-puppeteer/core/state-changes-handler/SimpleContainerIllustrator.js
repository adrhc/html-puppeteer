import ComponentIllustrator from "./ComponentIllustrator.js";
import SimpleTemplateView from "../view/SimpleTemplateView.js";

/**
 * @typedef {SimpleViewOptions} SimpleContainerIllustratorOptions
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends ComponentIllustrator {
    /**
     * @param {SimpleContainerIllustratorOptions} options
     * @param {SimpleViewOptions=} options.viewConfig
     */
    constructor({viewProviderFn, ...viewConfig}) {
        super();
        this.view = viewProviderFn ? viewProviderFn(viewConfig) : this._createView(viewConfig);
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
        // do nothing
    }
}
