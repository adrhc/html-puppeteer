/**
 * This is the component's configuration which could be constructed from HTML data-* values.
 */
class SimpleListConfiguration extends ComponentConfiguration {
    /**
     * @type {"prepend"|"append"|undefined}
     */
    rowPositionOnCreate;
    /**
     * items formatted as JSON
     *
     * @type {string|string[]|undefined}
     */
    items;

    /**
     * @param {{}=} dataAttributes
     */
    constructor(dataAttributes) {
        super();
        // Object.assign(this, dataAttributes);
        _.defaults(this, dataAttributes);
    }

    /**
     * This is the computed/runtime value of items.
     *
     * @return {[]}
     */
    get parsedItems() {
        const configItems = this.items ?? [];
        return typeof configItems === "string" ? JSON.parse(configItems) : configItems;
    }

    /**
     * @return {boolean|undefined} this.simpleListConfiguration?.rowPositionOnCreate === "append"
     */
    get newItemsGoLast() {
        return this.rowPositionOnCreate == null ? undefined : this.rowPositionOnCreate === "append";
    }
}