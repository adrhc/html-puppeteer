/**
 * @see also MustacheTableElemAdapterOptions
 */
class SimpleListOptions extends AbstractComponentOptions {
    /**
     * @type {string|jQuery<HTMLTableElement>}
     */
    elemIdOrJQuery;
    /**
     * @type {string}
     */
    bodyRowTmplId;
    /**
     * @type {string}
     */
    bodyRowTmplHtml;
    /**
     * @type {string}
     */
    bodyTmplHtml;
    /**
     * @type {string}
     */
    rowDataId;
    /**
     * @type {string}
     */
    childProperty;
    /**
     * @type {CrudRepository}
     */
    repository;
    /**
     * @type {MustacheTableElemAdapter}
     */
    mustacheTableElemAdapter;

    /**
     * @param {{}} options are the programmatically (javascript) passed options
     * @return {SimpleListOptions} is the options with the defaults applied
     */
    constructor(options) {
        super(options);
        const simpleListOptions = _.defaults(new SimpleListOptions(), options);
        simpleListOptions.config = options.config ?? new SimpleListConfiguration(options);
        simpleListOptions.state = options.state ?? new SimpleListState();
        simpleListOptions.view = options.view ?? SimpleListView.of(simpleListOptions);
        return simpleListOptions;
    }

    /**
     * @return {SimpleListView}
     */
    get simpleListView() {
        return this.view;
    }

    /**
     * @return {SimpleListConfiguration}
     */
    get simpleListConfiguration() {
        return this.config;
    }

    /**
     * @return {TableElementAdapter}
     */
    get tableElementAdapter() {
        return this.simpleListView?.tableAdapter;
    }

    /**
     * @return {"prepend"|"append"|undefined} this.simpleListConfiguration?.rowPositionOnCreate
     */
    get rowPositionOnCreate() {
        return this.simpleListConfiguration?.rowPositionOnCreate;
    }

    /**
     * @return {boolean|undefined} this.simpleListConfiguration?.rowPositionOnCreate === "append"
     */
    get newItemsGoLast() {
        const rowPositionOnCreate = this.simpleListConfiguration?.rowPositionOnCreate;
        return rowPositionOnCreate == null ? undefined : rowPositionOnCreate === "append";
    }

    /**
     * This is the computed/runtime value of items.
     *
     * @return {[]}
     */
    get items() {
        const configItems = this.simpleListConfiguration?.items ?? [];
        return typeof configItems === "string" ? JSON.parse(configItems) : configItems;
    }
}