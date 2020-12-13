class AbstractTableComponent {
    mustacheTableElemAdapter;

    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param state
     * @param view {AbstractTableBasedView}
     */
    constructor(mustacheTableElemAdapter, state, view) {
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
        this.state = state;
        this.view = view;
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
}