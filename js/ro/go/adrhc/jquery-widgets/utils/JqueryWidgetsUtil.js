class JqueryWidgetsUtil {
    /**
     * Avoids skip-jq-auto="true".
     */
    static autoInit() {
        $("[data-jq-type]").each((index, el) => {
            const $el = $(el);
            const skipAuto = $el.data("skip-jq-auto");
            if (skipAuto) {
                return;
            }
            const type = $el.data("jq-type");
            // const comp = eval(`new ${type}()`);
            // const comp = new window[type]($el);
            // const comp = (Function(`return new ${type}`))($el);
            /*
                        const dynamicClass = eval(type);
                        const comp = new dynamicClass($el);
            */
            // console.log(JqueryWidgetsUtil.instantiateByName(type, $el));
            JqueryWidgetsUtil.instantiateByName(type, $el);
        });
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