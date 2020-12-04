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

    setTitle(title) {
        this.title = title;
        let optionsPromise;
        if (this.cachePrefix == null || !title.startsWith(this.cachePrefix)) {
            this.cachePrefix = title;
            optionsPromise = this.repository.findByTitle(title);
        } else {
            optionsPromise = Promise.resolve(this.options);
        }
        optionsPromise.then(options => {
            this.options = options;
            this.selectedItem = this._findOption();
            this.found = !!this.selectedItem;
        });
    }

    _findOption() {
        return this.options.find(o => o.title === this.title);
    }

    setSelectItemId(id) {
        this.selectedItem = this.options.find(o => o.id === id);
    }
}