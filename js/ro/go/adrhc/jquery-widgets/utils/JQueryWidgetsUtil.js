class JQueryWidgetsUtil {
    /**
     * @return {AbstractComponent|Promise<AbstractComponent>|Array<AbstractComponent|Promise<AbstractComponent>>}
     */
    static autoCreate() {
        const components = $("[data-jqw-type]").map((index, el) => {
            const $el = $(el);
            const type = JQueryWidgetsUtil.componentType($el);
            // const comp = eval(`new ${type}()`);
            // const comp = new window[type]($el);
            // const comp = (Function(`return new ${type}`))($el);
            /*
                const dynamicClass = eval(type);
                const comp = new dynamicClass($el);
            */
            // console.log(JQueryWidgetsUtil.instantiateByName(type, $el));
            return JQueryWidgetsUtil.instantiateByName(type, $el);
        });
        if (components.length === 1) {
            return components[0];
        }
        return components;
    }

    /**
     * @param {string} type
     * @param {jQuery<HTMLElement>} $el
     * @return {DrawingComponent}
     */
    static instantiateByName(type, $el) {
        const dynamicClass = eval(type);
        const args = Array.prototype.slice.call(arguments, 1);
        return new dynamicClass(...args);
    }

    static componentType($el) {
        const type = $el.data("jqw-type");
        if (type.endsWith("Component")) {
            return type;
        } else {
            return `${_.capitalize(type)}Component`;
        }
    }
}