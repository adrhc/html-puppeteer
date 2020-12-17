class AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        this.tableAdapter = mustacheTableElemAdapter;
    }

    get owner() {
        return this.tableAdapter.tableId;
    }

    /**
     * @param stageChanges {StateChange|StateChange[]}
     * @return {Promise<StateChange|StateChange[]>}
     * @abstract
     */
    update(stageChanges) {
        throw "Not implemented!";
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

    /**
     * @param $elem {jQuery<HTMLTableRowElement>}
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     * @protected
     */
    _extractInputValues($elem, useOwnerOnFields) {
        const owner = useOwnerOnFields ? this.owner : undefined;
        return FormUtils.prototype.objectifyInputsOf($elem, owner);
    }
}