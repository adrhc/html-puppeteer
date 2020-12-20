class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {TableElementAdapter}
     */
    tableAdapter;

    /**
     * @param view {AbstractTableBasedView}
     */
    constructor(view) {
        super();
        this.tableAdapter = view.tableAdapter;
        this.view = view;
    }

    /**
     * @param elem {HTMLElement|jQuery}
     * @param searchParentsForDataIdIfMissingOnElem {boolean|undefined}
     * @return {string|number}
     */
    rowDataIdOf(elem, searchParentsForDataIdIfMissingOnElem) {
        return this.tableAdapter.rowDataIdOf(elem, searchParentsForDataIdIfMissingOnElem);
    }

    get ownerSelector() {
        return this.tableAdapter.ownerSelector;
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean|undefined}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.view.extractAllRowsInputValues(useOwnerOnFields)
            .map(it => EntityUtils.prototype.removeTransientId(it));
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param rowDataId {number|string}
     * @param useOwnerOnFields {boolean|undefined}
     * @return {IdentifiableEntity}
     */
    extractEntityByDataId(rowDataId, useOwnerOnFields) {
        const values = this.view.extractInputValuesByDataId(rowDataId, useOwnerOnFields);
        return EntityUtils.prototype.removeTransientId(values);
    }

    get owner() {
        return this.tableAdapter.tableId;
    }

    close() {
        this.tableAdapter.$table.off(this.eventsNamespace);
    }
}