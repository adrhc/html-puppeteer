class DynaSelOneConfig extends ComponentConfiguration {
    static DEFAULTS = {
        minCharsToSearch: 3,
        optionsToShow: 5,
        tmplUrl: "js/ro/go/adrhc/jquery-widgets/components/dynamic-select-one/templates/dyna-sel-one.html"
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
    tmplUrl = DynaSelOneConfig.DEFAULTS.tmplUrl;

    /**
     * Evaluation order: props, data-* of props.elemIdOrJQuery, DynaSelOneConfig.DEFAULTS
     *
     * @param {Object=} props are the programmatically (javascript) passed configuration options
     * @return {DynaSelOneConfig}
     */
    static of(props) {
        const config = _.defaults(new DynaSelOneConfig(), props,
            DomUtils.dataOf(props.elemIdOrJQuery), DynaSelOneConfig.DEFAULTS);
        config.searchOnBlur = config.searchOnBlur ?? config.minCharsToSearch > 0;
        config.loadOptionsOnInit = config.loadOptionsOnInit ?? config.minCharsToSearch === 0;
        return config;
    }

    /**
     * @param text {string|undefined}
     * @returns {boolean}
     */
    isEnoughTextToSearch(text) {
        return this.minCharsToSearch === 0 || !!text && text.length >= this.minCharsToSearch;
    }
}