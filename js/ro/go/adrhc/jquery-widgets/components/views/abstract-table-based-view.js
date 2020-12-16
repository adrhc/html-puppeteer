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
     * @param useOwnerOnFields {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractEntities(useOwnerOnFields) {
        return this.tableAdapter.$getAllRows()
            .map((index, elem) =>
                EntityFormUtils.prototype.extractEntityFrom($(elem), useOwnerOnFields ? this.owner : undefined))
            .get();
    }
}