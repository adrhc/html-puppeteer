import GlobalConfig, {typeOf} from "../util/GlobalConfig.js";
import {createByType} from "./ComponentFactories.js";
import {idOf} from "../util/DomUtils.js";
import {isTrue} from "../util/AssertionUtils.js";
import ChildrenComponents from "./component/composition/ChildrenComponents.js";

/**
 * @param {AnimationOptions} options
 * @property {ElemIdOrJQuery=} options.componentsHolder
 * @property {boolean=} options.alwaysReturnArray
 * @property {SpecificComponentOptions=} childrenComponentsCommonOptions
 * @return {AbstractComponent|AbstractComponent[]}
 */
export default function animate({componentsHolder, alwaysReturnArray, ...childrenComponentsCommonOptions} = {}) {
    const childrenComponents = new ChildrenComponents({
        /** @type {ElemIdOrJQuery} */ componentsHolder, childrenComponentsCommonOptions
    });
    const components = childrenComponents.createChildrenForExistingShells();
    const partNames = Object.keys(components);
    console.log(`[Puppeteer.animate] childrenComponents created ${partNames.length} components`);
    if (partNames.length === 1 && !alwaysReturnArray) {
        return components[partNames[0]];
    }
    return partNames.map(p => components[p]);
}

/**
 * @param {jQuery<HTMLElement>=} $el
 * @param {ComponentOptions & SpecificComponentOptions=} options
 * @return {AbstractComponent}
 */
export function createComponent($el, options) {
    isTrue($el.length === 1,
        `[createComponent] bad $el.length = ${$el.length}!`);
    const type = typeOf($el);
    const componentId = idOf($el);
    const componentOptions = componentOptionsOf(componentId, options);
    return instanceOf($el, type, componentOptions);
}

/**
 * @param {string=} componentId
 * @param {ComponentOptions & SpecificComponentOptions} options
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
