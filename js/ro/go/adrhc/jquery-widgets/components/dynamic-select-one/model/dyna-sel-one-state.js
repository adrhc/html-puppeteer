class DynaSelOneState {
    /**
     * @param repository {DynaSelOneRepository}
     * @param minCharsToSearch {number}
     * @param options {DynaSelOneItem[]|undefined}
     * @param searchLastSearchResult {boolean|undefined}
     */
    constructor(repository, {
        minCharsToSearch = 3,
        options,
        searchLastSearchResult
    }) {
        this.repository = repository;
        this.minCharsToSearch = minCharsToSearch;
        this.options = options;
        this.searchLastSearchResult = searchLastSearchResult;
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
     * - don't do 2 things in same step (e.g. update the model and cache some values)
     * - do multiple things sequentially (if not possible in parallel)
     * - gather all data then update the model then compute derivatives then cache
     *
     * @param title {string|undefined}
     * @returns {Promise<DynaSelOneState>}
     */
    updateByTitle(title) {
        console.log("DynaSelOneState.updateByTitle title =", title);
        if (this.searchLastSearchResult && this.title === title) {
            // updating with same title
            console.log(`rejecting update with same title: ${!!title ? title : "nothing"}`);
            return Promise.reject(this);
        }
        if (!this.isEnoughTextToSearch(title)) {
            // new title is too short
            this._update(title);
            return Promise.resolve(this);
        }
        let optionsPromise;
        if (this.searchLastSearchResult && this.currentOptionsAreResultOfSearch && title.startsWith(this.title)) {
            // new title contains the current title: searching existing options
            optionsPromise = Promise.resolve(this._findOptionsByTitleStartingWith(title));
        } else {
            // new title doesn't contain the current title: searching the DB
            optionsPromise = this.repository.findByTitle(title);
        }
        return optionsPromise.then(options => {
            this._update(title, options);
            return this;
        });
    }

    /**
     * update the model then compute derivatives
     *
     * @param title {string|undefined}
     * @param options {DynaSelOneItem[]|undefined}
     * @private
     */
    _update(title, options) {
        this.options = options;
        this.selectedItem = this._findOptionByTitle(title);
        if (this.selectedItem) {
            this.title = this.selectedItem.title;
        } else {
            this.title = title;
        }
    }

    /**
     * @param text {string}
     * @returns {DynaSelOneItem[]|undefined}
     * @private
     */
    _findOptionsByTitleStartingWith(text) {
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
    _findOptionByTitle(title) {
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
        return this.options.find(opt => EntityUtils.prototype.idsAreEqual(opt.id, id));
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
        return !!text && text.length >= this.minCharsToSearch;
    }

    /**
     * @returns {number|*}
     */
    get optionsLength() {
        return !this.options || !this.options.length ? 0 : this.options.length;
    }
}