export default class GlobalConfig {
    static ALERT_ON_FAILED_ASSERTION = true;
    static DATA_CHILDREN = "children";
    /**
     * the child "part" name in the parent's state
     */
    static DATA_PART = "part";
    /**
     * the component type
     */
    static DATA_TYPE = "type";
    static DEFAULT_CHILDREN_ROOM = "";
    static ELEM_ID_OR_JQUERY = "elemIdOrJQuery";
    static ID_ATTR = "id";
    static OWNER_ATTR = "owner";
    static SERVER_ROOT = "";
}

export function dataType() {
    return `data-${GlobalConfig.DATA_TYPE}`;
}

export function dataPart() {
    return `data-${GlobalConfig.DATA_PART}`;
}

export function dataChildren() {
    return `data-${GlobalConfig.DATA_CHILDREN}`;
}

/**
 * @param {string=} owner
 * @param {boolean=} useDoubleQuotes
 */
export function dataOwnerOf(owner, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return owner == null ? `data-${GlobalConfig.OWNER_ATTR}` : `data-${GlobalConfig.OWNER_ATTR}=${quote}${owner}${quote}`;
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

/**
 * @param {string=} childrenRoomName
 * @param {boolean=} useDoubleQuotes
 */
export function dataChildrenSelectorOf(childrenRoomName, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return childrenRoomName == null ? `[${dataChildren()}]` : `[${dataChildren()}=${quote}${childrenRoomName}${quote}]`;
}
