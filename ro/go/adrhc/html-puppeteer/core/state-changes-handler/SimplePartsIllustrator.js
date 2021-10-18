import ComponentIllustrator from "./ComponentIllustrator.js";
import StateChange from "../state/change/StateChange.js";
import GlobalConfig from "../../util/GlobalConfig.js";

/**
 * @typedef {ComponentIllustratorOptions} SimplePartsIllustratorOptions
 * @property {string=} componentId
 */
/**
 * @template SCT, SCP
 * @extends {PartialStateChangesHandler}
 */
export default class SimplePartsIllustrator extends ComponentIllustrator {
    /**
     * @param {SimplePartsIllustratorOptions} options
     * @param {ViewValuesTransformerFn} options.viewValuesTransformerFn
     * @param {string} options.componentId
     * @param {AbstractComponent=} options.parent
     * @param {PartName=} options.part
     * @param {ComponentIllustratorOptions} options.restOfOptions
     */
    constructor({viewValuesTransformerFn, componentId, parent, part, ...restOfOptions}) {
        super(_.defaults(restOfOptions, {
            viewValuesTransformerFn: viewValuesTransformerFn ??
                defaultViewValuesTransformerFn(componentId, parent?.id, part)
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

function defaultViewValuesTransformerFn(componentId, parentId, partName) {
    return parentId != null ? ((value) => defaultViewValuesTransformerFnImpl(componentId, parentId, partName, value)) : undefined;
}

function defaultViewValuesTransformerFnImpl(componentId, parentId, partName, value) {
    return {
        [GlobalConfig.VIEW_VALUE_FIELD]: value,
        [GlobalConfig.COMPONENT_ID]: componentId,
        [GlobalConfig.OWNER]: parentId,
        [GlobalConfig.PART]: partName
    };
}