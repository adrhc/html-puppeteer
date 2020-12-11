class TableEditorView {
    /**
     * @param readOnlyRow {ReadOnlyRow}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter, readOnlyRow) {
        this.readOnlyRow = readOnlyRow;
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
    }

    init(items) {
        if ($.isArray(items)) {
            this.mustacheTableElemAdapter.renderBody({items});
        } else {
            this.mustacheTableElemAdapter.renderBody(items);
        }
    }

    /**
     * @param stateChanges {SelectableStateChange[]|undefined}
     */
    updateView(stateChanges) {
        if (!stateChanges) {
            // selection not changed, do nothing
            return Promise.reject();
        }
        stateChanges.forEach(sc => {
            switch (sc.crudOperation) {
                case "DELETE":
                    this.mustacheTableElemAdapter.deleteRowByDataId(sc.item.id)
                    break;
                default:
                    const isNotFirstRow = sc.position > 0;
                    if (this.readOnlyRow) {
                        this.readOnlyRow.show(sc.item, !isNotFirstRow);
                    } else {
                        // by default only create the row but won't fill it
                        this.mustacheTableElemAdapter.renderRowBeforeDataId(sc.item.id, undefined, undefined, true, !isNotFirstRow);
                    }
                    break;
            }
        })
        return Promise.resolve(stateChanges);
    }

    /**
     * @param tr {HTMLTableRowElement}
     * @return {string}
     */
    rowDataIdOf(tr) {
        const $elem = $(tr);
        const ownerSelector = this.mustacheTableElemAdapter.ownerSelector;
        if ($elem.is(ownerSelector)) {
            return $(tr).data("id");
        } else {
            return $(tr).parents(`tr${ownerSelector}`).data("id");
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