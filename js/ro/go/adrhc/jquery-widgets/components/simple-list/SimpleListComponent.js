/**
 * A component rendering a table by using a list of items.
 * Updatable by a state change containing all items.
 */
class SimpleListComponent extends AbstractTableBasedComponent {
    static MESSAGES = {reloadSuccessful: "Datele au fost reîncărcate!"};
    /**
     * @type {SimpleListState}
     */
    simpleListState;
    /**
     * @type {CrudRepository}
     */
    repository;

    /**
     * @param {string|jQuery<HTMLTableElement>} tableIdOrJQuery
     * @param {IdentifiableEntity[]=} items
     * @param {string=} bodyRowTmplId could be empty when not using a row template (but only the table)
     * @param {string=} bodyRowTmplHtml
     * @param {MustacheTableElemAdapter=} mustacheTableElemAdapter
     * @param {CrudRepository=} repository
     * @param {SimpleListView=} view
     * @param {SimpleListState=} state
     * @param {string=} childProperty
     * @param {ChildishBehaviour=} childishBehaviour permit CreateDeleteListComponent to update its parent
     * @param {ComponentConfiguration=} config
     */
    constructor(tableIdOrJQuery, {
        bodyRowTmplId,
        bodyRowTmplHtml,
        childProperty,
        config = ComponentConfiguration.configWithOverrides(tableIdOrJQuery, {
            bodyRowTmplId,
            bodyRowTmplHtml,
            childProperty
        }),
        items = [],
        mustacheTableElemAdapter = new MustacheTableElemAdapter(
            tableIdOrJQuery, config.bodyRowTmplId, config.bodyRowTmplHtml),
        repository = new InMemoryCrudRepository(items),
        state = new SimpleListState(),
        view = new SimpleListView(mustacheTableElemAdapter),
        childishBehaviour,
    }) {
        super({view, state, childishBehaviour, config: config.dontAutoInitializeOf()});
        this.setHandlerName("updateViewOnAny", "CREATE", "REPLACE", "DELETE");
        this.simpleListState = state;
        this.repository = repository;
        return this._handleAutoInitialization();
    }

    /**
     * RELOAD
     *
     * @param ev {Event}
     */
    onReload(ev) {
        ev.stopPropagation();
        /**
         * @type {SimpleListComponent}
         */
        const simpleListComponent = ev.data;
        simpleListComponent._handleReload();
    }

    /**
     * Although very similar to init, reload is another scenario, that's why it's ok to have its own method.
     *
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _handleReload() {
        this.reset();
        return this.init().then(this._handleSuccessfulReload);
    }

    /**
     * Called after successfully reloading (i.e. after _handleReload call).
     *
     * @private
     */
    _handleSuccessfulReload() {
        alert(SimpleListComponent.MESSAGES.reloadSuccessful);
    }

    /**
     * Replaces the state with the one loaded from repository.
     *
     * @return {Promise<*>}
     * @protected
     */
    _reloadState() {
        return this._handleRepoErrors(this.repository.findAll())
            .then((items) => {
                console.log(`${this.constructor.name}._reloadState items:\n`, JSON.stringify(items));
                this._replaceState(items);
                return items;
            });
    }

    /**
     * Dealing with the actual state replacement only.
     *
     * @param {[]} items
     * @protected
     */
    _replaceState(items) {
        this.simpleListState.updateAll(items);
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @protected
     */
    _configureEvents() {
        console.log(`${this.constructor.name}._configureEvents`);
        this.view.$elem.on(this._appendNamespaceTo("click"),
            this._btnSelector("reload"), this, this.onReload);
    }
}