class JQWUtil {
    static TYPE = "jqw-type";
    static COMPONENT_NAME_SUFIX = "Component";

    /**
     * @param {jQuery|HTMLElement=} context
     * @return {AbstractComponent|Promise<AbstractComponent>|Array<AbstractComponent|Promise<AbstractComponent>>}
     */
    static createComponents(context) {
        const components = JQWUtil.componentsOf(context)
            .map((index, el) => {
                const $el = $(el);
                const type = JQWUtil.componentTypeOf($el);
                return JQWUtil.componentInstanceFor(type, $el);
            });
        if (components.length === 1) {
            return components[0];
        }
        return components;
    }

    /**
     * @param {jQuery|HTMLElement=} context
     * @return {jQuery}
     */
    static componentsOf(context) {
        return $(`[data-${JQWUtil.TYPE}]`, context);
    }

    /**
     * @param {string} type
     * @param {jQuery<HTMLElement>} $el
     * @return {DrawingComponent}
     */
    static componentInstanceFor(type, $el) {
        const dynamicClass = eval(type);
        const args = Array.prototype.slice.call(arguments, 1);
        return new dynamicClass(...args);
    }

    static componentTypeOf($el) {
        const type = $el.data(JQWUtil.TYPE);
        if (type.endsWith(JQWUtil.COMPONENT_NAME_SUFIX)) {
            return type;
        } else {
            return `${_.capitalize(type)}${JQWUtil.COMPONENT_NAME_SUFIX}`;
        }
    }
}