/**
 * tableAdapter is configuration managed by the provider
 *
 * @abstract
 */
class AbstractTableBasedView extends AbstractView {
    /**
     * @type {TableElementAdapter}
     */
    tableAdapter;

    /**
     * @param {TableElementAdapter} tableElementAdapter
     */
    constructor(tableElementAdapter) {
        super();
        this.tableAdapter = tableElementAdapter;
        this.$elem = this.tableAdapter.$table;
        this.owner = this.tableAdapter.owner;
    }

    /**
     * By default this component won't use the owner to detect its fields.
     *
     * @param useOwnerOnFields {boolean|undefined}
     * @return {Array<{}>}
     * @protected
     */
    extractInputValues(useOwnerOnFields) {
        return this.tableAdapter.$getAllRows()
            .map((index, elem) =>
                FormUtils.prototype.objectifyInputsOf($(elem), useOwnerOnFields ? this.owner : undefined))
            .get();
    }

    /**
     * @param elem {HTMLElement|jQuery<HTMLElement>}
     * @param [searchParentsForDataIdIfMissingOnElem] {boolean}
     * @return {string|number}
     */
    rowDataIdOf(elem, searchParentsForDataIdIfMissingOnElem) {
        return this.tableAdapter.rowDataIdOf(elem, searchParentsForDataIdIfMissingOnElem);
    }
}