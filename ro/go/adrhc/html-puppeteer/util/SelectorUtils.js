import GlobalConfig from "./GlobalConfig.js";

/**
 * @param {string} name
 * @param {string=} owner
 * @return {jQuery<HTMLElement>}
 */
export function $btnOf(name, owner) {
    const selector = btnSelectorOf(name, owner);
    return !selector ? undefined : $(selector);
}

/**
 * @param {string} name
 * @param {string=} owner
 * @return {string}
 */
export function btnSelectorOf(name, owner) {
    return name == null ? "" : `${dataOwnerSelectorOf(owner)}[name='${name}']`;
}

/**
 * @param {string=} value
 * @param {string=} owner
 * @return {string}
 */
export function dataBtn(value, owner) {
    return value == null ? "" : `${dataOwnerSelectorOf(owner)}[data-btn='${value}']`;
}

/**
 * @param {PartName=} partName
 * @param {boolean=} useDoubleQuotes
 */
export function dataPartSelectorOf(partName, useDoubleQuotes) {
    return dataSelectorOf(GlobalConfig.DATA_PART, partName, useDoubleQuotes, "");
}

/**
 * @param {string=} owner
 * @param {boolean=} useDoubleQuotes
 */
export function dataOwnerSelectorOf(owner, useDoubleQuotes) {
    return dataSelectorOf(GlobalConfig.DATA_OWNER, owner, useDoubleQuotes, "");
}

/**
 * @param {string=} guestsRoomName
 * @param {boolean=} useDoubleQuotes
 */
export function dataGuestsSelectorOf(guestsRoomName, useDoubleQuotes) {
    return dataSelectorOf(GlobalConfig.DATA_GUESTS, guestsRoomName, useDoubleQuotes);
}

/**
 * @param {string=} guestsRoomName
 * @param {boolean=} useDoubleQuotes
 */
export function dataComponentIdSelectorOf(guestsRoomName, useDoubleQuotes) {
    return dataSelectorOf(GlobalConfig.DATA_COMPONENT_ID, guestsRoomName, useDoubleQuotes, "");
}

/**
 * @param {string=} idAttr
 * @param {boolean=} useDoubleQuotes
 */
export function idAttrSelectorOf(idAttr, useDoubleQuotes) {
    const quote = useDoubleQuotes ? '"' : "'";
    return idAttr == null ? "" : `[${GlobalConfig.ID_ATTR}=${quote}${idAttr}${quote}]`;
}

export function dataTypeSelector() {
    return dataSelectorOf(GlobalConfig.DATA_TYPE);
}

export function dataPartSelector() {
    return dataSelectorOf(GlobalConfig.DATA_PART);
}

export function dataSelectorOf(name, value, useDoubleQuotes, dataAttrForEmptyValue) {
    const quote = useDoubleQuotes ? '"' : "'";
    return value == null ? (dataAttrForEmptyValue ?? `[data-${name}]`) : `[data-${name}=${quote}${value}${quote}]`;
}