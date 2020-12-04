class DynamicSelectOneState {
    /**
     * @param found
     * @param title
     * @param selectedItem {DynaSelOneItem|undefined}
     * @param cachePrefix
     * @param options {DynaSelOneItem[]|undefined}
     */
    constructor(title, selectedItem, cachePrefix, options, found) {
        this.id = Math.random();
        this.title = title;
        this.selectedItem = selectedItem;
        this.cachePrefix = cachePrefix;
        this.options = options;
        this.found = found;
    }

    setTitle(title) {
        this.title = title;
    }

    setSelectItemId(id) {
        this.selectedItem = this.options.find(o => o.id === id);
    }
}