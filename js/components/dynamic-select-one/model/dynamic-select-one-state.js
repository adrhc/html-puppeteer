class DynamicSelectOneState {
    /**
     * @param repository
     * @param title
     * @param selectedItem {DynaSelOneItem|undefined}
     * @param cachePrefix
     * @param options {DynaSelOneItem[]|undefined}
     * @param found
     */
    constructor(repository, title, selectedItem, cachePrefix, options, found) {
        this.repository = repository;
        this.title = title;
        this.selectedItem = selectedItem;
        this.cachePrefix = cachePrefix;
        this.options = options;
        this.found = found;
    }

    /**
     * @param title
     * @returns {Promise<DynamicSelectOneState>}
     */
    setTitle(title) {
        console.log("title =", title);
        if (this.title === title) {
            return Promise.resolve(this);
        }
        this.title = title;
        let optionsPromise;
        if (this.cachePrefix == null || !title.startsWith(this.cachePrefix)) {
            this.cachePrefix = title;
            optionsPromise = this.repository.findByTitle(title);
        } else {
            optionsPromise = Promise.resolve(this.options);
        }
        return optionsPromise.then(options => {
            this.options = options;
            this.selectedItem = this._findOption();
            this.found = !!this.selectedItem;
            if (this.found) {
                this.title = this.selectedItem.title;
            }
            return this;
        });
    }

    _findOption() {
        return this.options.find(o => o.title === this.title);
    }

    setSelectItemId(id) {
        this.selectedItem = this.options.find(o => o.id === id);
        if (!this.selectedItem) {
            console.error("Selected missing option! id =", id);
        }
        return this.setTitle(this.selectedItem.title);
    }

    get hasOptions() {
        return this.options && this.options.length;
    }
}