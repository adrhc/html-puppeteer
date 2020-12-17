class AbstractTableBasedComponent {
    /**
     * @type {TableElementAdapter}
     */
    tableAdapter;

    /**
     * @param view {AbstractTableBasedView}
     */
    constructor(view) {
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

    /**
     * @param events {string,string[]}
     * @return {string|*}
     */
    withNamespaceFor(events) {
        if ($.isArray(events)) {
            return events.map(ev => this.withNamespaceFor(ev)).join(" ");
        } else {
            return `${events}${this.eventsNamespace}`;
        }
    }

    get eventsNamespace() {
        return `.${this.constructor.name}.${this.owner}`;
    }

    get ownerSelector() {
        return this.tableAdapter.ownerSelector;
    }

    get owner() {
        return this.tableAdapter.tableId;
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

    /**
     * (internal) errors handler
     *
     * @param promise
     * @return {Promise<any>}
     * @protected
     */
    handleRepoErrors(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(`${textStatus}\n${jqXHR.responseText}`);
            throw textStatus;
        });
    }

    close() {
        this.tableElementAdapter.$table.off(this.eventsNamespace);
    }
}