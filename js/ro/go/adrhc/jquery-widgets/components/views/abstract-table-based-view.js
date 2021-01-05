/**
 * @abstract
 */
class AbstractTableBasedView extends AbstractView {
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
     * by default this component won't use the owner to detect its fields
     *
     * @param rowDataId {number|string}
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     */
    extractInputValuesByDataId(rowDataId, useOwnerOnFields) {
        const $row = this.tableAdapter.$getRowByDataId(rowDataId)
        return FormUtils.prototype.objectifyInputsOf($row, useOwnerOnFields ? this.owner : undefined);
    }

    /**
     * keep owner and tableAdapter
     */
    reset() {
        super.reset();
        this.tableAdapter = undefined;
    }
}