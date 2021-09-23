export default class GlobalConfig {
    static ALERT_ON_FAILED_ASSERTION = true;
    /**
     * the child "part" name in the parent's state
     */
    static DATA_PART = "part";
    /**
     * the component type
     */
    static DATA_TYPE = "type";
    static ELEM_ID_OR_JQUERY = "elemIdOrJQuery";
    static OWNER = "owner";
    static SERVER_ROOT = "";
}

export function dataType() {
    return `data-${GlobalConfig.DATA_TYPE}`;
}

export function dataPart() {
    return `data-${GlobalConfig.DATA_PART}`;
}

/**
 * @param {string=} type
 * @param {boolean=} useDoubleQuotes
 */
export function dataTypeSelectorOf(type, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return type == null ? `[${dataType()}]` : `[${dataType()}=${quote}${type}${quote}]`;
}

/**
 * @param {string=} partName
 * @param {boolean=} useDoubleQuotes
 */
export function dataPartSelectorOf(partName, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return partName == null ? `[${dataPart()}]` : `[${dataPart()}=${quote}${partName}${quote}]`;
}
