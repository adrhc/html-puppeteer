import GlobalConfig from "../../util/GlobalConfig.js";

/**
 * @param {string} componentId
 * @param {string=} parentId
 * @param {OptionalPartName=} partName
 * @return {ViewValuesTransformerFn}
 */
export function hierarchyAwareViewValuesTransformer(componentId, parentId, partName) {
    if (partName != null) {
        return value => componentAwareViewValuesTransformer(componentId, parentId, partName, value);
    }
}

export function componentAwareViewValuesTransformer(componentId, parentId, partName, value) {
    return {
        [GlobalConfig.VIEW_VALUE_FIELD]: value,
        [GlobalConfig.COMPONENT_ID]: componentId,
        [GlobalConfig.OWNER]: parentId,
        [GlobalConfig.PART]: partName
    };
}