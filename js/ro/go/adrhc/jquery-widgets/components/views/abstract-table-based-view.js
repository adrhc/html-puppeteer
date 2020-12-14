class AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
    }

    /**
     * @param elem {HTMLElement}
     * @return {string}
     */
    rowDataIdOf(elem) {
        const $elem = $(elem);
        const ownerSelector = this.mustacheTableElemAdapter.ownerSelector;
        if ($elem.is(ownerSelector)) {
            return $elem.data("id");
        } else {
            return $elem.parents(`tr${ownerSelector}`).data("id");
        }
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
}