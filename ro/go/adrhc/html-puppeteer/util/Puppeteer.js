import GlobalConfig from "./GlobalConfig";

/**
 * @typedef {Object} createComponents~Options
 * @property {jQuery<HTMLElement>=} parentComponentElem
 * @property {boolean=} alwaysReturnArray
 */
export default class Puppeteer {
    /**
     * @param {jQuery<HTMLElement>=} parentComponentElem
     * @param {boolean=} alwaysReturnArray
     * @return {AbstractComponent|AbstractComponent[]}
     */
    static animate(parentComponentElem, alwaysReturnArray) {
        const components = Puppeteer.componentsOf(parentComponentElem);
        console.log("components.length:", components.length);
        if (components.length === 1 && !alwaysReturnArray) {
            return components[0];
        }
        return components;
    }

    /**
     * @param {jQuery<HTMLElement>=} parentComponentElem
     * @return {AbstractComponent|AbstractComponent[]}
     */
    static componentsOf(parentComponentElem) {
        return Puppeteer.$componentElementsOf(parentComponentElem)
            .map((index, el) => {
                const $el = $(el);
                const type = Puppeteer.componentTypeOf($el);
                return Puppeteer.instanceOf(type, $el);
            });
    }

    /**
     * @param {jQuery<HTMLElement>=} parentComponentElem
     * @return {jQuery}
     */
    static $componentElementsOf(parentComponentElem) {
        return $(`[data-${GlobalConfig.DATA_TYPE}]`, parentComponentElem);
    }

    /**
     * @param {string} type
     * @param {jQuery<HTMLElement>} $el
     * @return {AbstractComponent}
     */
    static instanceOf(type, $el) {
        const dynamicClass = eval(type);
        return new dynamicClass({elemIdOrJQuery: $el});
    }

    /**
     * @param {jQuery<HTMLElement>} $el
     * @return {string}
     */
    static componentTypeOf($el) {
        const type = $el.data(GlobalConfig.DATA_TYPE);
        if (type.endsWith(GlobalConfig.COMPONENT_NAME_SUFFIX)) {
            return type;
        } else {
            return `${_.startCase(type)}${GlobalConfig.COMPONENT_NAME_SUFFIX}`;
        }
    }
}