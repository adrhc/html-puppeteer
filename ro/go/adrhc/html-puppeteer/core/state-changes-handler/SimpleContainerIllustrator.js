import ComponentIllustrator from "./ComponentIllustrator.js";
import {simpleTemplateViewProvider} from "../view/SimpleTemplateView.js";
import {withViewProvider} from "../component/options/ComponentOptionsBuilder.js";
import {$childrenRoomOf} from "../Puppeteer.js";

/**
 * @typedef {ComponentIllustratorOptions & AbstractTemplateViewOptions} SimpleContainerIllustratorOptions
 * @property {string|jQuery<HTMLElement>=} childrenRoom is the container's element having [data-children=""]
 * property {string} childrenElemType
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends ComponentIllustrator {
    /**
     * @type {jQuery<HTMLElement>}
     */
    childrenRoom;

    /**
     * @param {SimpleContainerIllustratorOptions} options
     * @param {SimpleContainerIllustratorOptions} options.restOfOptions
     */
    constructor({childrenRoom, ...restOfOptions}) {
        super(withViewProvider(simpleTemplateViewProvider).to(restOfOptions));
        this.childrenRoom = childrenRoom ?? $childrenRoomOf(restOfOptions.elemIdOrJQuery);
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
