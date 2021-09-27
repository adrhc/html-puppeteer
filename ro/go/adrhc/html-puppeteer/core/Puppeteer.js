import {dataPartSelectorOf, dataSelectorOf} from "../util/SelectorUtils.js";
import GlobalConfig from "../util/GlobalConfig.js";
import {createByType} from "./ComponentsFactories.js";
import {jQueryOf} from "../util/DomUtils.js";
import {isTrue} from "../util/AssertionUtils.js";

/**
 * @param {{}=} commonOptions
 * @param {jQuery<HTMLElement>=} parentComponentElem
 * @param {boolean=} dontRender
 * @param {boolean=} alwaysReturnArray
 * @return {AbstractComponent|jQuery<AbstractComponent>}
 */
export default function animate(commonOptions, dontRender, parentComponentElem, alwaysReturnArray) {
    const components = createComponents(parentComponentElem, commonOptions);
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
 * @param {Bag} commonOptions
 * @return {AbstractComponent|AbstractComponent[]}
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
 * @param {Bag} commonOptions
 * @return {AbstractComponent}
 */
export function createComponent($el, commonOptions) {
    isTrue($el.length === 1,
        `[createComponent] bad $el.length = ${$el.length}!`);
    const type = componentTypeOf($el);
    const partName = componentPartOf($el);
    const componentOptions = componentOptionsOf(partName, commonOptions);
    return instanceOf($el, type, componentOptions);
}

function componentOptionsOf(partName, commonOptions) {
    return _.defaults({}, commonOptions?.[partName], commonOptions);
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
 * @return {string}
 * @protected
 */
function componentPartOf($el) {
    return $el.data(GlobalConfig.DATA_PART);
}

/**
 * @param {jQuery<HTMLElement>} $el
 * @param {string} type
 * @param {Bag} componentOptions
 * @return {AbstractComponent}
 * @protected
 */
function instanceOf($el, type, componentOptions = {}) {
    const elemIdOrJQuery = GlobalConfig.ELEM_ID_OR_JQUERY;
    return createByType(type, {...componentOptions, [elemIdOrJQuery]: $el});
}

/**
 * @param {jQuery<AbstractComponent>} $components
 * @protected
 */
function renderComponents($components) {
    $components.each((index, comp) => comp.render());
}

export function $getPartElem(partName, parentElemIdOrJQuery) {
    return $(dataPartSelectorOf(partName), jQueryOf(parentElemIdOrJQuery));
}

/**
 * @param {string|jQuery<HTMLElement>} parentElemIdOrJQuery
 * @return {jQuery<HTMLElement>}
 */
export function $guestsRoomOf(parentElemIdOrJQuery) {
    const $parent = jQueryOf(parentElemIdOrJQuery);
    const $guestsRoom = $parent.find(dataSelectorOf(GlobalConfig.DATA_GUESTS));
    isTrue($guestsRoom.length < 2);
    return $guestsRoom.length ? $guestsRoom : $parent;
}
