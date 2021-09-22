import GlobalConfig from "../util/GlobalConfig.js";
import {createByType} from "./ComponentsFactories.js";

/**
 * @param {{}=} componentsOptions
 * @param {jQuery<HTMLElement>=} parentComponentElem
 * @param {boolean=} dontRender
 * @param {boolean=} alwaysReturnArray
 * @return {AbstractComponent|AbstractComponent[]}
 */
export default function animate(componentsOptions, dontRender, parentComponentElem, alwaysReturnArray) {
    const components = componentsOf(parentComponentElem, componentsOptions);
    console.log("[Puppeteer.animate] components.length:", components.length);
    if (!dontRender) {
        renderComponents(components);
    }
    if (components.length === 1 && !alwaysReturnArray) {
        return components[0];
    }
    return components;
}

/**
 * @param {jQuery<HTMLElement>=} parentComponentElem
 * @param {{}} componentsOptions
 * @return {AbstractComponent|AbstractComponent[]}
 * @protected
 */
function componentsOf(parentComponentElem, componentsOptions) {
    return $componentElementsOf(parentComponentElem)
        .map((index, el) => {
            const $el = $(el);
            const type = componentTypeOf($el);
            return instanceOf(type, $el, componentsOptions);
        });
}

/**
 * @param {jQuery<HTMLElement>=} parentComponentElem
 * @return {jQuery}
 * @protected
 */
function $componentElementsOf(parentComponentElem) {
    return $(`[data-${GlobalConfig.DATA_TYPE}]`, parentComponentElem);
}

/**
 * @param {jQuery<HTMLElement>} $el
 * @return {string}
 * @protected
 */
function componentTypeOf($el) {
    return $el.data(GlobalConfig.DATA_TYPE);
}

/**
 * @param {string} type
 * @param {jQuery<HTMLElement>} $el
 * @param {{}} componentOptions
 * @return {AbstractComponent}
 * @protected
 */
function instanceOf(type, $el, componentOptions = {}) {
    return createByType(type, {elemIdOrJQuery: $el, ...componentOptions});
}

/**
 * @param {jQuery<AbstractComponent>} $components
 * @protected
 */
function renderComponents($components) {
    $components.each((index, comp) => comp.render());
}
