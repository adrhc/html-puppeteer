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
}