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
    /**
     * @type {string}
     */
    elemIdOrJQuery;

    constructor({
                    dontConfigEventsOnError,
                    dontAutoInitialize,
                    dontReloadFromState,
                    clearChildrenOnReset,
                    updateViewOnce,
                    skipOwnViewUpdates,
                    childProperty,
                    elemIdOrJQuery
                } = {}) {
        this.dontConfigEventsOnError = dontConfigEventsOnError;
        this.dontAutoInitialize = dontAutoInitialize;
        this.dontReloadFromState = dontReloadFromState;
        this.clearChildrenOnReset = clearChildrenOnReset;
        this.updateViewOnce = updateViewOnce;
        this.skipOwnViewUpdates = skipOwnViewUpdates;
        this.childProperty = childProperty;
        this.elemIdOrJQuery = elemIdOrJQuery;
    }

    /**
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} defaults are applied from left to right (first applied wins)
     * @return {ComponentConfiguration}
     */
    static configOf(elemIdOrJQuery, ...defaults) {
        return ComponentConfiguration._configOf(new ComponentConfiguration(), elemIdOrJQuery, ...defaults);
    }

    /**
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} overrides are applied from left to right (first applied wins)
     * @return {ComponentConfiguration}
     */
    static configWithOverrides(elemIdOrJQuery, ...overrides) {
        return ComponentConfiguration._configWithOverrides(new ComponentConfiguration(), elemIdOrJQuery, ...overrides);
    }

    static _configOf(instance, elemIdOrJQuery, ...defaults) {
        // return fp.defaults(new ComponentConfiguration(), ...sources, DomUtils.dataOf(elemIdOrJQuery));
        // return Object.assign(new ComponentConfiguration(), fp.defaultsAll([{}, ...sources, DomUtils.dataOf(elemIdOrJQuery)]));
        return _.defaults(instance, DomUtils.dataOf(elemIdOrJQuery), {elemIdOrJQuery}, ...defaults);
    }

    static _configWithOverrides(instance, elemIdOrJQuery, ...overrides) {
        return _.defaults(instance, ...overrides, DomUtils.dataOf(elemIdOrJQuery), {elemIdOrJQuery});
    }

    /**
     * @param {Object} overwrites
     * @return {ComponentConfiguration}
     */
    overwriteWith(...overwrites) {
        return _.defaults(new ComponentConfiguration(), ...overwrites, this);
    }

    /**
     * @param {boolean=} dontAutoInitialize
     * @return {ComponentConfiguration}
     */
    dontAutoInitializeOf(dontAutoInitialize = true) {
        return this.overwriteWith({dontAutoInitialize});
    }
}