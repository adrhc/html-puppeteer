import ComponentIllustrator from "./ComponentIllustrator.js";
import {simpleTemplateViewProvider} from "../view/SimpleTemplateView.js";
import {withViewProvider} from "../component/options/ComponentOptionsBuilder.js";
import {$childrenRoomOf} from "../Puppeteer.js";

/**
 * @typedef {ComponentIllustratorOptions & AbstractTemplateViewOptions} SimpleContainerIllustratorOptions
 * @property {string|jQuery<HTMLElement>=} childrenRoom is the container's element having [data-children=""]
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends ComponentIllustrator {
    /**
     * @param {SimpleContainerIllustratorOptions} options
     * @param {SimpleContainerIllustratorOptions} options.restOfOptions
     */
    constructor({elemIdOrJQuery, childrenRoom, ...restOfOptions}) {
        super(withViewProvider(simpleTemplateViewProvider)
            .withViewElem(childrenRoom ?? $childrenRoomOf(elemIdOrJQuery))
            .to(restOfOptions));
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
