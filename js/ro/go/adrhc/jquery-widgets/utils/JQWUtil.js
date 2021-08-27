/**
 * @typedef {jQuery<HTMLElement>|HTMLElement} jQueryOrHtmlElem
 *
 * @typedef {Object} OptionsType
 * @property {jQueryOrHtmlElem} parentComponentElem
 * @property {boolean} dontAutoInitialize
 * @property {boolean} alwaysReturnArray
 */
class JQWUtil {
    static COMPONENT_TYPE = "jqw-type";
    static COMPONENT_NAME_SUFIX = "Component";

    /**
     * @param {OptionsType} options
     * @return {AbstractComponent|AbstractComponent[]}
     */
    static createComponents(options = {}) {
        const components = JQWUtil.$componentElementsOf(options.parentComponentElem)
            .map((index, el) => {
                const $el = $(el);
                const type = JQWUtil.componentTypeOf($el);
                return JQWUtil.componentInstanceFor(type, $el, options);
            });
        console.log("components.length:", components.length);
        if (components.length === 1 && !options.alwaysReturnArray) {
            return components[0];
        }
        return components;
    }

    /**
     * @param {jQueryOrHtmlElem=} parentComponentElem
     * @return {jQuery}
     */
    static $componentElementsOf(parentComponentElem) {
        return $(`[data-${JQWUtil.COMPONENT_TYPE}]`, parentComponentElem);
    }

    /**
     * @param {string} type
     * @param {jQueryOrHtmlElem} $el
     * @param {OptionsType} options
     * @return {AbstractComponent}
     */
    static componentInstanceFor(type, $el, options) {
        const dynamicClass = eval(type);
        new dynamicClass(_.defaults({elemIdOrJQuery: $el}, options));
    }

    /**
     * @param {jQueryOrHtmlElem} $el
     * @return {string}
     */
    static componentTypeOf($el) {
        const type = $el.data(JQWUtil.COMPONENT_TYPE);
        if (type.endsWith(JQWUtil.COMPONENT_NAME_SUFIX)) {
            return type;
        } else {
            return `${_.upperFirst(type)}${JQWUtil.COMPONENT_NAME_SUFIX}`;
        }
    }
}