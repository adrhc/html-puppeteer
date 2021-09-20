import StateChange from "../state/change/StateChange.js";
import SimpleView from "../view/SimpleView.js";
import ComponentIllustrator from "./ComponentIllustrator.js";

/**
 * @typedef {AbstractTemplatingViewOptions} AbstractTemplatingViewOptionsWithView
 * @property {SimpleView=} view
 */
/**
 * @implements {PartialStateChangesHandler}
 * @extends {ComponentIllustrator}
 */
export default class SimplePartComponentIllustrator extends ComponentIllustrator {
    /**
     * @param {AbstractTemplatingViewOptionsWithView} options
     * @param {AbstractTemplatingViewOptions=} viewConfig
     */
    constructor({view, ...viewConfig}) {
        super();
        this.view = view ?? this._createView(viewConfig);
    }

    /**
     * @param {AbstractTemplatingViewOptions} viewConfig
     * @return {SimpleView}
     * @protected
     */
    _createView(viewConfig) {
        return new SimpleView(viewConfig);
    }

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