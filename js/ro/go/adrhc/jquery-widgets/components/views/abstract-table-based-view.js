/**
 * tableAdapter is configuration managed by the provider
 *
 * @abstract
 */
class AbstractTableBasedView extends AbstractView {
    /**
     * @type {MustacheTableElemAdapter}
     */
    tableAdapter;

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        super();
        this.tableAdapter = mustacheTableElemAdapter;
        this.$elem = this.tableAdapter.$table;
        this.owner = this.tableAdapter.owner;
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean|undefined}
     * @return {Array<{}>}
     */
    extractAllRowsInputValues(useOwnerOnFields) {
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