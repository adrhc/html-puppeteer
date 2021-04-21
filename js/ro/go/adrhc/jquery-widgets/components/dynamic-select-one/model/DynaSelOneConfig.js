class DynaSelOneConfig extends ComponentConfiguration {
    static DEFAULTS = {
        minCharsToSearch: 3,
        optionsToShow: 5,
    };
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
    optionsToShow;
    /**
     * @type {string}
     */
    tmplUrl = "js/ro/go/adrhc/jquery-widgets/components/dynamic-select-one/templates/dyna-sel-one.html";

    /**
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} defaults are applied from left to right (first applied wins)
     * @return {DynaSelOneConfig}
     */
    static configOf(elemIdOrJQuery, ...defaults) {
        const config = ComponentConfiguration._configOf(new DynaSelOneConfig(), elemIdOrJQuery, ...defaults, DynaSelOneConfig.DEFAULTS);
        config.searchOnBlur = config.searchOnBlur ?? config.minCharsToSearch > 0;
        config.loadOptionsOnInit = config.loadOptionsOnInit ?? config.minCharsToSearch === 0;
        return config;
    }

    /**
     * @param {Object} overwrites
     * @return {DynaSelOneConfig}
     */
    overwriteWith(...overwrites) {
        return _.defaults(new DynaSelOneConfig(), ...overwrites, this);
    }

    /**
     * @param {boolean=} dontAutoInitialize
     * @return {DynaSelOneConfig}
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