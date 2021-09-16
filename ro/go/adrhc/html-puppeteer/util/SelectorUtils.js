import GlobalConfig from "./GlobalConfig.js";

export function namedBtn(name, owner) {
    return name == null ? "" : `${dataOwner(owner)}[name='${name}']`;
}

/**
 * @param {string=} value
 * @param {string=} owner
 * @return {string}
 */
export function dataBtn(value, owner) {
    return value == null ? "" : `${dataOwner(owner)}[data-btn='${value}']`;
}

/**
 * @param {string=} owner
 * @return {string}
 */
export function dataOwner(owner) {
    return owner == null ? "" : `[data-${GlobalConfig.OWNER}='${name}']`;
}