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
        const $elem = this.tableAdapter.$getRowByDataId(rowDataId)
        return FormUtils.prototype.objectifyInputsOf($elem, useOwnerOnFields ? this.owner : undefined);
    }

    get owner() {
        return this.tableAdapter.owner;
    }
}