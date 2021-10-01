import SimpleComponent from "./component/SimpleComponent.js";
import SimpleContainerComponent from "./component/SimpleContainerComponent.js";
import ValueComponent from "./component/ValueComponent.js";
import StaticContainerComponent from "./component/StaticContainerComponent.js";

/**
 * @typedef {function(options: AbstractComponentOptions): AbstractComponent} ComponentProviderFn
 */

/**
 * @type {{[key: string]: ComponentProviderFn}}
 */
const COMPONENT_TYPES = {
    "simple": (options) => new SimpleComponent(options),
    "value": (/** @type {ValueComponentOptions} */ options) => new ValueComponent(options),
    "simple-container": (options) => new SimpleContainerComponent(options),
    "static-container": (options) => new StaticContainerComponent(options),
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

