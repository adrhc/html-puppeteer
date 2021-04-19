class DynaSelOneConfig extends ComponentConfiguration {
    /**
     * @type {function(): IdentifiableEntity}
     */
    toEntityConverter;
    /**
     * @type {number}
     */
    minCharsToSearch = 3;
    /**
     * @type {boolean}
     */
    cacheSearchResults;
    /**
     * @type {boolean}
     */
    searchOnBlur = true;
    /**
     * whether to focus the search input on init
     *
     * @type {boolean}
     */
    focus;
    /**
     * @type {boolean}
     */
    loadOptionsOnInit;
    /**
     * the search form field name
     *
     * @type {string}
     */
    name;
    /**
     * the value hidden field name
     *
     * @type {string}
     */
    value;
    /**
     * the description hidden field name
     *
     * @type {string}
     */
    description;
    /**
     * @type {string}
     */
    placeholder;
    /**
     * @type {number}
     */
    optionsToShow = 5;
    /**
     * @type {string}
     */
    tmplUrl = "js/ro/go/adrhc/jquery-widgets/components/dynamic-select-one/templates/dyna-sel-one.html";

    /**
     *
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} defaults are applied from left to right (last applied wins)
     * @return {DynaSelOneConfig}
     */
    static configOf(elemIdOrJQuery, ...defaults) {
        // return fp.defaults(new ComponentConfiguration(), ...sources, DomUtils.dataOf(elemIdOrJQuery));
        // return Object.assign(new ComponentConfiguration(), fp.defaultsAll([{}, ...sources, DomUtils.dataOf(elemIdOrJQuery)]));
        const config = $.extend(new DynaSelOneConfig(), {elemIdOrJQuery}, ...defaults, DomUtils.dataOf(elemIdOrJQuery));
        config.searchOnBlur = config.searchOnBlur ?? config.minCharsToSearch > 0;
        config.loadOptionsOnInit = config.loadOptionsOnInit ?? config.minCharsToSearch === 0;
        return config;
    }

    /**
     * @param {Object} overwrites
     * @return {ComponentConfiguration}
     */
    overwriteWith(...overwrites) {
        return $.extend(new DynaSelOneConfig(), this, ...overwrites);
    }

    /**
     * @param {boolean=} dontAutoInitialize
     * @return {ComponentConfiguration}
     */
    dontAutoInitializeOf(dontAutoInitialize = true) {
        return this.overwriteWith({dontAutoInitialize});
    }

    /**
     * @param text {string|undefined}
     * @returns {boolean}
     */
    isEnoughTextToSearch(text) {
        return this.minCharsToSearch === 0 || !!text && text.length >= this.minCharsToSearch;
    }
}