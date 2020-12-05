class DynamicSelectOneState {
    /**
     * @param repository
     * @param minCharsToSearch {number}
     * @param title {string}
     * @param options {DynaSelOneItem[]|undefined}
     */
    constructor(repository, minCharsToSearch, title, options) {
        this.repository = repository;
        this.minCharsToSearch = minCharsToSearch;
        this._updateOptions(title, options);
    }

    /**
     * @param id {number}
     * @returns {Promise<DynamicSelectOneState>}
     */
    updateById(id) {
        console.log("id =", id);
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
     * - gather all data but only then update the model
     *
     * @param title {string|undefined}
     * @returns {Promise<DynamicSelectOneState>}
     */
    updateByTitle(title) {
        console.log("title =", title);
        if (this.title === title) {
            return Promise.reject();
        }
        if (!this.isEnoughTextToSearch(title)) {
            this._updateOptions(title);
            return Promise.resolve(this);
        }
        let optionsPromise;
        if (this.currentOptionsAreResultOfSearch && title.startsWith(this.title)) {
            // new title contains the current title
            optionsPromise = Promise.resolve(this._findOptionsByTitleStartingWith(title));
        } else {
            // new title doesn't contain the current title
            optionsPromise = this.repository.findByTitle(title);
        }
        return optionsPromise.then(options => {
            this._updateOptions(title, options);
            return this;
        });
    }

    /**
     * @param title {string|undefined}
     * @param options {DynaSelOneItem|undefined}
     * @private
     */
    _updateOptions(title, options) {
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
     * @returns {DynaSelOneItem|undefined}
     * @private
     */
    _findOptionsByTitleStartingWith(text) {
        if (!this.options) {
            return undefined;
        }
        return this.options.filter(opt => opt.title.startsWith(text));
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
        return this.options.find(opt => opt.title === title);
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
        return this.options.find(opt => opt.id == id);
    }

    get currentOptionsAreResultOfSearch() {
        return this.isEnoughTextToSearch(this.title);
    }

    /**
     * @param text {string|undefined}
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