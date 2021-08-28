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
        return this.simpleListConfiguration.parsedItems;
    }
}