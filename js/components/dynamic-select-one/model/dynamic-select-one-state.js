class DynamicSelectOneState {
    /**
     * @param repository
     * @param minCharsToSearch {Number}
     * @param title {String}
     * @param selectedItem {DynaSelOneItem|undefined}
     * @param optionsPrefix {String}
     * @param options {DynaSelOneItem[]|undefined}
     */
    constructor(repository, minCharsToSearch, title,
                selectedItem, optionsPrefix, options) {
        this.repository = repository;
        this.minCharsToSearch = minCharsToSearch;
        this.title = title;
        this.selectedItem = selectedItem;
        this.cachePrefix = optionsPrefix;
        this.options = options;
    }

    /**
     * @param title
     * @returns {Promise<DynamicSelectOneState>}
     */
    setTitle(title) {
        console.log("title =", title);
        if (!this.isEnoughTextForSearch(title) || this.title === title) {
            return Promise.reject();
        }
        this.title = title;
        let optionsPromise;
        const newTitleContainsCurrentPrefix = this.cachePrefix != null && title.startsWith(this.cachePrefix);
        this.cachePrefix = title;
        if (newTitleContainsCurrentPrefix) {
            this.options = this.options.filter(o => o.title.startsWith(title));
            optionsPromise = Promise.resolve(this.options);
        } else {
            optionsPromise = this.repository.findByTitle(title);
        }
        return optionsPromise.then(options => {
            this.options = options;
            this.selectedItem = this._findOption();
            if (this.selectedItem) {
                this.title = this.selectedItem.title;
            }
            return this;
        });
    }

    deactivateEdit(title) {
        if (this.isEnoughTextForSearch(title)) {
            // search new title
            return this.setTitle(title);
        } else if (this.selectedItem) {
            // restore active selection
            this.title = this.selectedItem.title;
            return Promise.resolve(this);
        } else {
            this.options = undefined;
            this.cachePrefix = undefined;
            this.title = title;
            return Promise.resolve(this);
        }
    }

    reset() {
        this.title = undefined;
        this.selectedItem = undefined;
        this.cachePrefix = undefined;
        this.options = undefined;
        return Promise.resolve(this);
    }

    _findOption() {
        return this.options.find(o => o.title === this.title);
    }

    /**
     * @param text {String}
     */
    isEnoughTextForSearch(text) {
        return !!text && text.length >= this.minCharsToSearch;
    }

    setSelectItemId(id) {
        console.log("id =", id);
        this.selectedItem = this.options.find(o => o.id == id);
        if (!this.selectedItem) {
            console.error("Selected missing option! id =", id);
        }
        return this.setTitle(this.selectedItem.title);
    }
}