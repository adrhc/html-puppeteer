class DynaSelOneState {
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
     * true: whether to show the text describing what was searched for but was not found
     *
     * This is ignored when something is actually selected/found (aka selectedItem != null).
     *
     * @type {boolean}
     */
    repositoryWasSearched;

    /**
     * @param {string} [title]
     * @param {DynaSelOneItem[]} [options]
     * @param {DynaSelOneItem} [selectedItem]
     * @param {boolean} [repositoryWasSearched]
     */
    constructor(title = "", options = [], selectedItem, repositoryWasSearched = true) {
        this.title = title;
        this.options = options;
        this.selectedItem = selectedItem;
        this.repositoryWasSearched = repositoryWasSearched;
    }

    /**
     * @returns {number|*}
     */
    get optionsLength() {
        return !this.options || !this.options.length ? 0 : this.options.length;
    }
}