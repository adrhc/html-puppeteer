import SimpleComponent from "./component/SimpleComponent.js";
import SimpleContainerComponent from "./component/SimpleContainerComponent.js";

/**
 * @typedef {function(options: Bag): AbstractContainerComponent} ComponentProviderFn
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
 * @return {AbstractContainerComponent}
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

