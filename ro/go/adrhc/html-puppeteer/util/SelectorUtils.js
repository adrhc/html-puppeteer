import GlobalConfig from "./GlobalConfig.js";

export function namedBtn(name, owner) {
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
 * @param {string=} ownerOwner
 * @param {boolean=} useDoubleQuotes
 */
export function dataOwnerOwnerSelectorOf(ownerOwner, useDoubleQuotes) {
    return dataSelectorOf(GlobalConfig.DATA_OWNER_OWNER, ownerOwner, useDoubleQuotes, "");
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

export function dataSelectorOf(name, value, useDoubleQuotes, dataAttrForEmptyValue) {
    const quote = useDoubleQuotes ? '"' : "'";
    return value == null ? (dataAttrForEmptyValue ?? `[data-${name}]`) : `[data-${name}=${quote}${value}${quote}]`;
}