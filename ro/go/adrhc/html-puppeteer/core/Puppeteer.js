import GlobalConfig, {typeOf} from "../util/GlobalConfig.js";
import {createByType} from "./ComponentFactories.js";
import {idOf} from "../util/DomUtils.js";
import {isTrue} from "../util/AssertionUtils.js";
import ChildrenComponents from "./component/composition/ChildrenComponents.js";

/**
 * @param {ChildrenComponentsOptions} options
 * @param {ElemIdOrJQuery=} componentsHolder is the place inside which to search for components
 * @param {boolean=} options.alwaysReturnArray
 * @param {ChildrenComponentsOptions=} options.childrenCreationCommonOptions
 * @return {AbstractComponent|AbstractComponent[]}
 */
export default function animate({componentsHolder, alwaysReturnArray, ...childrenCreationCommonOptions} = {}) {
    const childrenComponents = new ChildrenComponents({componentsHolder, childrenCreationCommonOptions});
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
 * @param {Bag=} commonOptions
 * @return {AbstractComponent}
 */
export function createComponent($el, commonOptions) {
    isTrue($el.length === 1,
        `[createComponent] bad $el.length = ${$el.length}!`);
    const type = typeOf($el);
    const componentId = idOf($el);
    const componentOptions = componentOptionsOf(componentId, commonOptions);
    return instanceOf($el, type, componentOptions);
}

function componentOptionsOf(componentId, commonOptions) {
    return _.defaults({}, commonOptions?.[componentId], commonOptions);
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
