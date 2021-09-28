export default class GlobalConfig {
    static ALERT_ON_FAILED_ASSERTION = true;

    /**
     * Used when rendering the component's shell.
     */
    static COMPONENT_ID = "componentId";
    /**
     * Used to find the HTML element of a component having its id generated (works with the manually set too).
     */
    static DATA_COMPONENT_ID = "component-id";
    static DATA_GUESTS = "guests";
    /**
     * If it is about an input field: is the field's parent component.
     * If it's about a component, is the component's parent component.
     *
     * @type {string}
     */
    static DATA_OWNER = "owner";
    /**
     * It's the owner of an owner.
     */
    static DATA_OWNER_OWNER = "owner-owner";
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
    static OWNER = "owner";
    static PART = "part";
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
 * @param {string=} componentId
 * @param {boolean=} useDoubleQuotes
 */
export function dataComponentIdOf(componentId, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return `data-${GlobalConfig.DATA_COMPONENT_ID}=${quote}${componentId}${quote}`;
}

/**
 * Used to extract a manually set component id.
 *
 * @param {jQuery<HTMLElement>} $elem
 * @return {string|undefined}
 */
export function idAttrOf($elem) {
    return $elem.attr(GlobalConfig.ID_ATTR);
}

/**
 * @param {jQuery<HTMLElement>} $elem
 * @return {string|undefined}
 */
export function ownerOf($elem) {
    return $elem.data(GlobalConfig.DATA_OWNER);
}

/**
 * @param {jQuery<HTMLElement>} $elem
 * @return {string|undefined}
 */
export function ownerOwnerOf($elem) {
    return $elem.data(GlobalConfig.DATA_OWNER_OWNER);
}

/**
 * @param {jQuery<HTMLElement>} $elem
 * @return {string|undefined}
 */
export function componentIdOf($elem) {
    return $elem.data(GlobalConfig.DATA_COMPONENT_ID);
}
