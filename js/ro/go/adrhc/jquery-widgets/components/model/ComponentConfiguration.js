class ComponentConfiguration {
    /**
     * @type {boolean}
     */
    dontConfigEventsOnError;
    /**
     * @type {boolean}
     */
    dontAutoInitialize;
    /**
     * @type {boolean}
     */
    dontReloadFromState;
    /**
     * @type {boolean}
     */
    clearChildrenOnReset;
    /**
     * @type {boolean}
     */
    updateViewOnce;
    /**
     * @type {boolean}
     */
    skipOwnViewUpdates;
    /**
     * @type {string}
     */
    childProperty;

    static configOf(elemIdOrJQuery, ...sources) {
        // return _.defaults(new ComponentConfiguration(), ...sources, DomUtils.dataOf(elemIdOrJQuery));
        return _.defaultsAll([new ComponentConfiguration(), ...sources, DomUtils.dataOf(elemIdOrJQuery)]);
    }
}