/**
 * todo: adapt to StateHolder usage
 */
class DynaSelOneState extends TaggingStateHolder {
    /**
     * @type {string}
     */
    title;
    /**
     * @type {DynaSelOneItem}
     */
    selectedItem;
    /**
     * @type {DynaSelOneItem[]}
     */
    options;
    /**
     * @type {boolean}
     */
    repositoryWasSearched;
    /**
     * this is configuration
     *
     * @type {boolean}
     */
    cacheSearchResults;
    /**
     * this is configuration
     *
     * @type {boolean}
     */
    searchOnBlur;
    /**
     * @type {boolean}
     */
    reloadOptionsOnInit;

    /**
     * @param {DynaSelOneRepository} repository
     * @param {number} minCharsToSearch
     * @param {DynaSelOneItem[]} [options]
     * @param {boolean} [cacheSearchResults]
     * @param {boolean} [searchOnBlur]
     * @param {boolean} [reloadOptionsOnInit]
     * @param {*} [initialState]
     * @param {IdentityStateChangeMapper} [stateChangeMapper]
     * @param {StateChangesCollector} [changesCollector]
     */
    constructor(repository, {
        minCharsToSearch = 3,
        options,
        cacheSearchResults,
        searchOnBlur = minCharsToSearch > 0,
        reloadOptionsOnInit = minCharsToSearch === 0,
        initialState,
        stateChangeMapper,
        changesCollector
    }) {
        super({initialState, stateChangeMapper, changesCollector});
        this.repository = repository;
        this.minCharsToSearch = minCharsToSearch;
        this.options = options;
        this.cacheSearchResults = cacheSearchResults;
        this.searchOnBlur = searchOnBlur;
        this.reloadOptionsOnInit = reloadOptionsOnInit;
    }

    /**
     * @param id {number}
     * @returns {Promise<DynaSelOneState>}
     */
    updateById(id) {
        console.log("DynaSelOneState.updateById: id =", id);
        const foundOption = this._findOptionById(id);
        if (!foundOption) {
            console.error("Selected missing option! id =", id);
            return Promise.reject();
        }
        return this.updateByTitle(foundOption.title);
    }

    /**
     * principle:
     * - don't do 2 things in same function (e.g. update the model and cache some values)
     * - gather all data then update the model then compute aggregated values then update the cache
     *
     * @param title {string|undefined}
     * @param [isOnBlur] {boolean} for true reject update with same title
     * @returns {Promise<DynaSelOneState>}
     */
    updateByTitle(title = "", isOnBlur) {
        console.log("DynaSelOneState.updateByTitle title =", title);
        if ((this.cacheSearchResults || isOnBlur) && this.title === title) {
            // updating with same title
            console.warn(`${this.constructor.name}.updateByTitle, rejecting update with same title: ${title ? title : "nothing"}`);
            return Promise.reject(this);
        }
        if (!this.isEnoughTextToSearch(title)) {
            // new title is too short
            this._update(title);
            return Promise.resolve(this);
        }
        let optionsPromise;
        if (this.cacheSearchResults && this.currentOptionsAreResultOfSearch && title.startsWith(this.title)) {
            // new title contains the current title: searching existing options
            optionsPromise = Promise.resolve(this._findOptionsByTitlePrefix(title));
        } else {
            // new title doesn't contain the current title: searching the DB
            optionsPromise = this.repositoryFindByTitle(title);
        }
        return optionsPromise.then(options => {
            this._update(title, options);
            return this;
        });
    }

    /**
     * @param title {string|undefined}
     */
    repositoryFindByTitle(title) {
        this.repositoryWasSearched = true;
        return this.repository.findByTitle(title);
    }

    /**
     * update the model then compute derivatives
     *
     * @param [title] {string}
     * @param [options] {DynaSelOneItem[]}
     * @private
     */
    _update(title, options) {
        this.options = options;
        this.selectedItem = this._findOptionByExactTitle(title);
        if (this.selectedItem) {
            this.title = this.selectedItem.title;
        } else {
            this.title = title;
        }
    }

    /**
     * @param dynaSelOneItem {DynaSelOneItem}
     */
    updateWithDynaSelOneItem(dynaSelOneItem) {
        if (dynaSelOneItem) {
            this._update(dynaSelOneItem.title, [dynaSelOneItem]);
        } else {
            this._update();
        }
    }

    /**
     * @param text {string}
     * @returns {DynaSelOneItem[]|undefined}
     * @private
     */
    _findOptionsByTitlePrefix(text) {
        if (!this.options) {
            return undefined;
        }
        return this.options.filter(opt => opt.title.toLowerCase().startsWith(text.toLowerCase()));
    }

    /**
     * @param title {string}
     * @returns {DynaSelOneItem|undefined}
     * @private
     */
    _findOptionByExactTitle(title = "") {
        if (!this.options) {
            return undefined;
        }
        return this.options.find(opt => opt.title.toLowerCase() === title.toLowerCase());
    }

    /**
     * @param id {number|string}
     * @returns {DynaSelOneItem|undefined}
     * @private
     */
    _findOptionById(id) {
        if (!this.options) {
            return undefined;
        }
        return this.options.find(opt => EntityUtils.idsAreEqual(opt.id, id));
    }

    /**
     * @returns {boolean}
     */
    get currentOptionsAreResultOfSearch() {
        return this.isEnoughTextToSearch(this.title);
    }

    /**
     * @param text {string|undefined}
     * @returns {boolean}
     */
    isEnoughTextToSearch(text) {
        return this.minCharsToSearch === 0 || !!text && text.length >= this.minCharsToSearch;
    }

    /**
     * @returns {number|*}
     */
    get optionsLength() {
        return !this.options || !this.options.length ? 0 : this.options.length;
    }

    get currentState() {
        return this;
    }

    reset() {
        super.reset();
        this.title = undefined;
        this.options = undefined;
        this.selectedItem = undefined;
        this.repositoryWasSearched = undefined;
    }
}