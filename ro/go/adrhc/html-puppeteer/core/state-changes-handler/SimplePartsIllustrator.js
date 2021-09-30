import ComponentIllustrator from "./ComponentIllustrator.js";
import StateChange from "../state/change/StateChange.js";
import GlobalConfig from "../../util/GlobalConfig.js";

/**
 * @typedef {ComponentIllustratorOptions} SimplePartsIllustratorOptions
 * @property {string=} componentId
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimplePartsIllustrator extends ComponentIllustrator {
    /**
     * @param {SimplePartsIllustratorOptions} options
     * @param {ViewValuesTransformerFn} options.viewValuesTransformerFn
     * @param {ComponentIllustratorOptions} options.restOfOptions
     */
    constructor({viewValuesTransformerFn, ...restOfOptions}) {
        super(_.defaults(restOfOptions, {
            viewValuesTransformerFn: viewValuesTransformerFn ??
                defaultViewValuesTransformerFn(restOfOptions.componentId, restOfOptions.parent, restOfOptions.part)
        }));
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

function defaultViewValuesTransformerFn(componentId, parent, partName) {
    return parent ? ((value) => defaultViewValuesTransformerFnImpl(componentId, parent.id, partName, value)) : undefined;
}

function defaultViewValuesTransformerFnImpl(componentId, parentId, partName, value) {
    return {
        [GlobalConfig.VIEW_VALUE_FIELD]: value,
        [GlobalConfig.COMPONENT_ID]: componentId,
        [GlobalConfig.OWNER]: parentId,
        [GlobalConfig.PART]: partName
    };
}