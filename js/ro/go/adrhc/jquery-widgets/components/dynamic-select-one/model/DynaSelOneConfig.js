class DynaSelOneConfig extends ComponentConfiguration {
    /**
     * @type {function(): IdentifiableEntity}
     */
    toEntityConverter;
    /**
     * @type {number}
     */
    minCharsToSearch;
    /**
     * @type {boolean}
     */
    cacheSearchResults;
    /**
     * @type {boolean}
     */
    searchOnBlur;
    /**
     * @type {boolean}
     */
    reloadOptionsOnInit;

    /**
     *
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} defaults are applied from left to right (last applied wins)
     * @return {DynaSelOneConfig}
     */
    static configOf(elemIdOrJQuery, ...defaults) {
        // return fp.defaults(new ComponentConfiguration(), ...sources, DomUtils.dataOf(elemIdOrJQuery));
        // return Object.assign(new ComponentConfiguration(), fp.defaultsAll([{}, ...sources, DomUtils.dataOf(elemIdOrJQuery)]));
        return $.extend(new DynaSelOneConfig(), {elemIdOrJQuery}, ...defaults, DomUtils.dataOf(elemIdOrJQuery));
    }
}