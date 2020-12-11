class SimpleTable {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param view {SimpleTableView}
     * @param state {SimpleTableState}
     */
    constructor(mustacheTableElemAdapter,
                repository = new InMemoryCrudRepository(),
                view = new SimpleTableView(mustacheTableElemAdapter),
                state = new SimpleTableState()) {
        this.mustacheTableElemAdapter = mustacheTableElemAdapter;
        this.repository = repository;
        this.view = view;
        this.state = state;
    }

    /**
     * new-item-creation event handler
     *
     * @param ev {Event}
     */
    onNewItem(ev) {
        const simpleTable = ev.data;
        const item = simpleTable.state.createNewItem();
        simpleTable.view.updateView([new CrudStateChange(item, 0, "CREATE")]);
    }

    /**
     * component initializer
     */
    init() {
        this._handleRepoError(this.repository.getAll())
            .then((items) => {
                console.log("TableEditorComponent items:\n", items);
                this.state.init(items);
                this.view.init(items);
            });
        this._configureEvents();
    }

    close() {
        this.mustacheTableElemAdapter.$table.off();
    }

    /**
     * (internal) errors handler
     *
     * @param promise
     * @return {Promise<any>}
     * @private
     */
    _handleRepoError(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(`${textStatus}\n${jqXHR.responseText}`);
            throw textStatus;
        });
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @private
     */
    _configureEvents() {
        // use $tbody to not mix with onNewItem
        this.mustacheTableElemAdapter.$table
            // dblclick on table header
            .on(this.eventsWithNamespace('dblclick'), `tr[data-owner='${this.owner}'][data-id='newItemBtn']`, this, this.onNewItem)
            // click on newItemBtn <button name='newItemBtn'>
            .on(this.eventsWithNamespace('click'), `button[data-owner='${this.owner}'][name='newItemBtn']`, this, this.onNewItem);
    }

    eventsWithNamespace(eventNames) {
        if ($.isArray(eventNames)) {
            return eventNames.map(ev => `${ev}.table-editor-${this.owner}`).join(" ");
        } else {
            return `${eventNames}.table-editor-${this.owner}`;
        }
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
}