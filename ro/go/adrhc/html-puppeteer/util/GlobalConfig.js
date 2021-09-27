export default class GlobalConfig {
    static ALERT_ON_FAILED_ASSERTION = true;
    static DATA_GUESTS = "guests";
    static DATA_OWNER = "owner";
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
    static SERVER_ROOT = "";
}

export function dataPartOf(partName, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return `data-${GlobalConfig.DATA_PART}=${quote}${partName}${quote}`;
}

export function dataTypeOf(type, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return `data-${GlobalConfig.DATA_TYPE}=${quote}${type}${quote}`;
}

/**
 * @param {string=} owner
 * @param {boolean=} useDoubleQuotes
 */
export function dataOwnerOf(owner, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return `data-${GlobalConfig.DATA_OWNER}=${quote}${owner}${quote}`;
}

/**
 * @param {jQuery<HTMLElement>} $elem
 * @return {string|undefined}
 */
export function idAttrOf($elem) {
    return $elem.attr(GlobalConfig.ID_ATTR);
}