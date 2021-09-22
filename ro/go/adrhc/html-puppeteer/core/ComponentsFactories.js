import SimpleComponent from "./component/SimpleComponent.js";
import SimpleContainerComponent from "./component/SimpleContainerComponent.js";
import {jQueryOf} from "../util/DomUtils.js";

/**
 * @typedef {function(options: Bag): AbstractComponent} ComponentProviderFn
 */

/**
 * @type {{[key: string]: ComponentProviderFn}}
 */
const COMPONENT_TYPES = {
    "simple": (options) => new SimpleComponent(options),
    "simple-container": (options) => new SimpleContainerComponent(options)
};

/**
 * @param {string} type
 * @param {{}=} options
 * @return {AbstractComponent}
 */
export function createByType(type, options) {
    const component = COMPONENT_TYPES[type]?.(options);
    if (!component) {
        throw new Error(`Bad component type: ${type}!`);
    }
    return component;
}

/**
 * @param {string} type
 * @param {ComponentProviderFn} componentProviderFn
 */
export function registerComponentType(type, componentProviderFn) {
    COMPONENT_TYPES[type] = componentProviderFn;
}

