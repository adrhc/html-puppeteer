class JQWUtil {
    static COMPONENT_TYPE = "jqw-type";
    static COMPONENT_NAME_SUFIX = "Component";

    /**
     * @typedef {jQuery<HTMLElement>|HTMLElement} jQueryOrHtmlElem
     */

    /**
     * @typedef {Object} OptionsType
     * @property {jQueryOrHtmlElem} parentComponentElem
     * @property {boolean} dontAutoInitialize
     * @property {boolean} alwaysReturnArray
     */

    /** @param {OptionsType} options
     * @return {AbstractComponent|Promise<AbstractComponent>|Array<AbstractComponent|Promise<AbstractComponent>>}
     */
    static createComponents(options = {}) {
        const components = JQWUtil.componentsOf(options.parentComponentElem)
            .map((index, el) => {
                const $el = $(el);
                const type = JQWUtil.componentTypeOf($el);
                return JQWUtil.componentInstanceFor(type, $el, options);
            });
        if (components.length === 1 && !options.alwaysReturnArray) {
            return components[0];
        }
        return components;
    }

    /**
     * @param {jQueryOrHtmlElem=} parentComponentElem
     * @return {jQuery}
     */
    static componentsOf(parentComponentElem) {
        return $(`[data-${JQWUtil.COMPONENT_TYPE}]`, parentComponentElem);
    }

    /**
     * @param {string} type
     * @param {jQueryOrHtmlElem} $el
     * @param {OptionsType} options
     * @return {DrawingComponent}
     */
    static componentInstanceFor(type, $el, options) {
        const dynamicClass = eval(type);
        return new dynamicClass(_.defaults({elemIdOrJQuery: $el}, options));
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