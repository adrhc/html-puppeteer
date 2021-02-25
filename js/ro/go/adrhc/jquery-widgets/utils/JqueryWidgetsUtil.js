class JqueryWidgetsUtil {
    /**
     * @return {AbstractComponent|Array<AbstractComponent|Promise<AbstractComponent>>}
     */
    static autoInit() {
        const components = $("[data-jq-type]").map((index, el) => {
            const $el = $(el);
            const type = $el.data("jq-type");
            // const comp = eval(`new ${type}()`);
            // const comp = new window[type]($el);
            // const comp = (Function(`return new ${type}`))($el);
            /*
                const dynamicClass = eval(type);
                const comp = new dynamicClass($el);
            */
            // console.log(JqueryWidgetsUtil.instantiateByName(type, $el));
            return JqueryWidgetsUtil.instantiateByName(type, $el);
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
}