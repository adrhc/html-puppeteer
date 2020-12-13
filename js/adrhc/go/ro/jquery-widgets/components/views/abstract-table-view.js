class AbstractTableView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
    }

    get owner() {
        return this.mustacheTableElemAdapter.tableId;
    }

    /**
     * @param stageChanges {StateChange|StateChange[]}
     * @abstract
     */
    update(stageChanges) {
        throw "Not implemented!";
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractEntities(useOwnerOnFields) {
        return this.mustacheTableElemAdapter.$getAllRows()
            .map((index, elem) =>
                EntityFormUtils.prototype.extractEntityFrom($(elem), useOwnerOnFields ? this.owner : undefined))
            .get();
    }

    /**
     * @param stateChange {StateChange}
     * @return {boolean}
     */
    supports(stateChange) {
        return false;
    }
}