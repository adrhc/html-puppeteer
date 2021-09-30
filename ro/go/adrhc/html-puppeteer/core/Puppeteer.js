import {dataSelectorOf} from "../util/SelectorUtils.js";
import GlobalConfig from "../util/GlobalConfig.js";
import {createByType} from "./ComponentFactories.js";
import {idOf} from "../util/DomUtils.js";
import {isTrue} from "../util/AssertionUtils.js";

/**
 * @param {{}=} commonOptions
 * @param {string|jQuery<HTMLElement>=} parentComponentElem A DOM Element, Document, jQuery or selector to use as context
 * @param {boolean=} dontRender
 * @param {boolean=} alwaysReturnArray
 * @return {AbstractComponent|jQuery[]}
 */
export default function animate(commonOptions, {parentComponentElem, dontRender, alwaysReturnArray} = {}) {
    const components = createComponents(parentComponentElem, commonOptions);
    console.log("[Puppeteer.animate] components.length:", components.length);
    if (!dontRender) {
        renderComponents(components);
    }
    if (components.length === 1 && !alwaysReturnArray) {
        return components[0];
    }
    return components.toArray();
}

/**
 * @param {jQuery<HTMLElement>=} parentComponentElem
 * @param {Bag} commonOptions
 * @return {jQuery<AbstractComponent>}
 * @protected
 */
function createComponents(parentComponentElem, commonOptions) {
    return $componentElementsOf(parentComponentElem)
        .map((index, el) => {
            const $el = $(el);
            return createComponent($el, commonOptions);
        });
}

/**
 * @param {jQuery<HTMLElement>=} $el
 * @param {Bag=} commonOptions
 * @return {AbstractComponent}
 */
export function createComponent($el, commonOptions) {
    isTrue($el.length === 1,
        `[createComponent] bad $el.length = ${$el.length}!`);
    const type = componentTypeOf($el);
    const componentId = idOf($el);
    const componentOptions = componentOptionsOf(componentId, commonOptions);
    return instanceOf($el, type, componentOptions);
}

function componentOptionsOf(componentId, commonOptions) {
    return _.defaults({}, commonOptions?.[componentId], commonOptions);
}

/**
 * @param {jQuery<HTMLElement>=} parentComponentElem
 * @return {jQuery}
 * @protected
 */
function $componentElementsOf(parentComponentElem) {
    return $(dataSelectorOf(GlobalConfig.DATA_TYPE), parentComponentElem);
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
 * @param {jQuery<HTMLElement>} $el
 * @param {string} type
 * @param {Bag} componentOptions
 * @return {AbstractComponent}
 * @protected
 */
function instanceOf($el, type, componentOptions = {}) {
    return createByType(type, {...componentOptions, [GlobalConfig.ELEM_ID_OR_JQUERY]: $el});
}

/**
 * @param {jQuery<AbstractComponent>} $components
 * @protected
 */
function renderComponents($components) {
    $components.each((index, comp) => comp.render());
}
