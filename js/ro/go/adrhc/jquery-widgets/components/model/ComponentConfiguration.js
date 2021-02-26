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
     * @type {string}
     */
    stateChangeRequest = "RENDER";
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
}