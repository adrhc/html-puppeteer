import SimpleComponent from "./component/SimpleComponent.js";
import SimpleContainerComponent from "./component/SimpleContainerComponent.js";
import ValueComponent from "./component/ValueComponent.js";
import StaticContainerComponent from "./component/StaticContainerComponent.js";
import DynamicContainerComponent from "./component/DynamicContainerComponent.js";
import BasicContainerComponent from "./component/BasicContainerComponent.js";

/**
 * @typedef {function(options: AbstractComponentOptions): AbstractComponent} ComponentProviderFn
 */

/**
 * @type {{[key: string]: ComponentProviderFn}}
 */
const COMPONENT_TYPES = {
    "simple": (options) => new SimpleComponent(options),
    "value": (options) => new ValueComponent(options),
    "simple-container": (options) => new SimpleContainerComponent(/** @type {SimpleContainerComponentOptions} */ options),
    "static-container": (options) => new StaticContainerComponent(/** @type {SimpleContainerComponentOptions} */ options),
    "dyna-container": (options) => new DynamicContainerComponent(/** @type {SimpleContainerComponentOptions} */ options),
    "basic-container": (options) => new BasicContainerComponent(/** @type {BasicContainerComponentOptions} */ options),
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

