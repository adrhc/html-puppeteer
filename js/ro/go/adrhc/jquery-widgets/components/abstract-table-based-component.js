class AbstractTableBasedComponent {
    mustacheTableElemAdapter;

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param view {AbstractTableBasedView}
     */
    constructor(mustacheTableElemAdapter, view) {
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
        this.view = view;
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
        return this.mustacheTableElemAdapter.ownerSelector;
    }

    get owner() {
        return this.mustacheTableElemAdapter.tableId;
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractEntities(useOwnerOnFields) {
        return this.view.extractEntities(useOwnerOnFields);
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