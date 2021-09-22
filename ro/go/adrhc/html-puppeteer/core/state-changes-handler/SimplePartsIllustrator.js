import SimpleTemplateView from "../view/SimpleTemplateView.js";
import ComponentIllustrator from "./ComponentIllustrator.js";
import StateChange from "../state/change/StateChange.js";

/**
 * @typedef {function(options: SimpleViewOptions): AbstractView} ViewProviderFn
 */
/**
 * @typedef {SimpleViewOptions} SimplePartsIllustratorOptions
 * @property {ViewProviderFn=} viewProviderFn
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimplePartsIllustrator extends ComponentIllustrator {
    /**
     * @param {SimplePartsIllustratorOptions} options
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
        super.replaced(new StateChange(partStateChange.previousState, partStateChange.newState))
    }
}