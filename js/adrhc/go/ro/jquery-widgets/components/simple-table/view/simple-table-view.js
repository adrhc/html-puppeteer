class SimpleTableView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
    }

    /**
     * @param items {IdentifiableEntity}
     */
    init(items) {
        if ($.isArray(items)) {
            this.mustacheTableElemAdapter.renderBody({items});
        } else {
            this.mustacheTableElemAdapter.renderBody(items);
        }
    }

    /**
     * @param crudChanges {CrudStateChange[]|undefined}
     */
    updateView(crudChanges) {
        if (!crudChanges) {
            // selection not changed, do nothing
            return Promise.reject();
        }
        crudChanges.forEach(sc => {
            switch (sc.crudOperation) {
                case "DELETE":
                    this.mustacheTableElemAdapter.deleteRowByDataId(sc.item.id)
                    break;
                default:
                    // if not 1th row than, if not already exists, it'll be placed as the last
                    const isNotFirstRow = sc.position > 0;
                    // by default only create the row but won't fill it
                    this.mustacheTableElemAdapter.renderRowBeforeDataId(sc.item.id, undefined, undefined, true, isNotFirstRow);
                    break;
            }
        })
        return Promise.resolve(crudChanges);
    }

    /**
     * @param tr {HTMLTableRowElement}
     * @return {string}
     */
    rowDataIdOf(tr) {
        const $elem = $(tr);
        const ownerSelector = this.mustacheTableElemAdapter.ownerSelector;
        if ($elem.is(ownerSelector)) {
            return $elem.data("id");
        } else {
            return $elem.parents(`tr${ownerSelector}`).data("id");
        }
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

    get owner() {
        return this.mustacheTableElemAdapter.tableId;
    }
}