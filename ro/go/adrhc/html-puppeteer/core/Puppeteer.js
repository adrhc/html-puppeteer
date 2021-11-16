import GlobalConfig, {typeOf} from "../util/GlobalConfig.js";
import {createByType} from "./ComponentFactories.js";
import {idOf} from "../util/DomUtils.js";
import {isTrue} from "../util/AssertionUtils.js";
import ChildrenCollection from "./component/composition/ChildrenCollection.js";

/**
 * @param {CreateComponentParams} options
 * @param {ElemIdOrJQuery=} options.componentsHolder
 * @param {boolean=} options.alwaysReturnArray
 * @param {CreateComponentParams=} componentsOptions are the options used to create the components for found shells
 * @return {AbstractComponent|AbstractComponent[]}
 */
export default function animate({componentsHolder, alwaysReturnArray, ...componentsOptions} = {}) {
    const childrenCollection = new ChildrenCollection({
        /** @type {ElemIdOrJQuery} */ componentsHolder, childrenOptions: componentsOptions
    });
    const components = childrenCollection.createChildrenForExistingShells();
    console.log(`[Puppeteer.animate] childrenCollection created ${components.length} components`);
    if (components.length === 1 && !alwaysReturnArray) {
        return components[0];
    }
    return components;
}

/**
 * @param {jQuery<HTMLElement>=} $el
 * @param {CreateComponentParams=} params
 * @return {AbstractComponent}
 */
export function createComponent($el, params) {
    isTrue($el.length === 1,
        `[createComponent] bad $el.length = ${$el.length}!`);
    const type = typeOf($el);
    const componentId = idOf($el);
    const componentOptions = componentOptionsOf(componentId, params);
    return instanceOf($el, type, componentOptions);
}

/**
 * @param {string=} componentId
 * @param {CreateComponentParams=} options
 * @return {ComponentOptions}
 */
function componentOptionsOf(componentId, options) {
    return _.defaults({}, options?.[componentId], options);
}

/**
 * @param {jQuery<HTMLElement>} $el
 * @param {string} type
 * @param {ComponentOptions} componentOptions
 * @return {AbstractComponent}
 */
function instanceOf($el, type, componentOptions = {}) {
    return createByType(type, {...componentOptions, [GlobalConfig.ELEM_ID_OR_JQUERY]: $el});
}
