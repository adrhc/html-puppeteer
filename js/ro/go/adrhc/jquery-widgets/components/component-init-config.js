class ComponentInitConfig {
    /**
     * @type {boolean}
     */
    dontConfigEventsOnError;
    /**
     * @type {function(data: *)}
     */
    beforeViewUpdateFn;

    /**
     * @param [dontConfigEventsOnError] {boolean}
     * @param [beforeViewUpdateFn] {function(data: *)}
     */
    constructor(dontConfigEventsOnError, beforeViewUpdateFn = () => {
    }) {
        this.dontConfigEventsOnError = dontConfigEventsOnError;
        this.beforeViewUpdateFn = beforeViewUpdateFn;
    }
}