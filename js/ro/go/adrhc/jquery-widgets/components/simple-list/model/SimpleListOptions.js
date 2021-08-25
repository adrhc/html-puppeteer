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
    rowPositionOnCreate;
    /**
     * @type {string}
     */
    childProperty;
    /**
     * @type {boolean}
     */
    dontAutoInitialize;
    /**
     * @type {string|IdentifiableEntity[]}
     */
    items;
    /**
     * @type {CrudRepository}
     */
    repository;
    /**
     * @type {MustacheTableElemAdapter}
     */
    mustacheTableElemAdapter;

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
        return this.simpleListView.tableAdapter;
    }

    /**
     * @return {"prepend"|"append"}
     */
    get rowPositionOnCreate() {
        return this.tableElementAdapter.rowPositionOnCreate
    }

    /**
     * @param {SimpleListOptions} options are the programmatically (javascript) passed options
     * @param {boolean=} forceDontAutoInitialize
     * @return {SimpleListOptions} is the options with the defaults applied
     */
    static of(options, forceDontAutoInitialize = options.forceDontAutoInitialize) {
        const simpleListOptions = _.defaults(new SimpleListOptions(), {forceDontAutoInitialize}, options);
        simpleListOptions.config = options.config ?? SimpleListConfiguration.of(options);
        simpleListOptions.state = options.state ?? new SimpleListState();
        simpleListOptions.view = options.view ?? SimpleListView.of(options, simpleListOptions.config);
        return simpleListOptions;
    }
}