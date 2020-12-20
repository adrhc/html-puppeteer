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
                this._extractInputValues($(elem), useOwnerOnFields))
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
        return this._extractInputValues($elem, useOwnerOnFields);
    }

    extractInputValues(useOwnerOnFields) {
        throw "Not implemented!";
    }

    get owner() {
        return this.tableAdapter.tableId;
    }
}