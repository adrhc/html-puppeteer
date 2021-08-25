/**
 * This is the component's configuration which could be constructed from HTML data-* values.
 *
 * @typedef {ComponentConfiguration} C
 */
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
     * @param {Object=} firstWinDefaults are applied from left to right (first applied wins)
     * @return {C}
     */
    static configWithDefaults(elemIdOrJQuery, ...firstWinDefaults) {
        return _.defaults(new ComponentConfiguration(), DomUtils.dataOf(elemIdOrJQuery), {elemIdOrJQuery}, ...firstWinDefaults);
    }

    /**
     * @param {Object} firstWinOverwrites
     * @return {C}
     */
    overwriteWith(...firstWinOverwrites) {
        return _.defaults(this._new(), ...firstWinOverwrites, this);
    }

    /**
     * @param {boolean=} dontAutoInitialize
     * @return {C}
     */
    dontAutoInitializeOf(dontAutoInitialize = true) {
        return this.overwriteWith({dontAutoInitialize});
    }

    /**
     * @return {C}
     * @protected
     */
    _new() {
        const configClass = eval(this.constructor.name);
        return new configClass();
    }
}