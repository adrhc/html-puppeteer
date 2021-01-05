class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {TableElementAdapter}
     */
    tableAdapter;
    /**
     * @type {AbstractTableBasedView}
     */
    abstractTableBasedView;

    /**
     * @param state {BasicState}
     * @param view {AbstractTableBasedView}
     */
    constructor(state, view) {
        super(state, view);
        this.abstractTableBasedView = view;
        this.tableAdapter = view.tableAdapter;
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
        return this.abstractTableBasedView.extractAllRowsInputValues(useOwnerOnFields)
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
        const values = this.abstractTableBasedView.extractInputValuesByDataId(rowDataId, useOwnerOnFields);
        return EntityUtils.prototype.removeTransientId(values);
    }

    close() {
        this.tableAdapter.$table.off(this._eventsNamespace);
        super.close();
    }
}