/**
 * A component rendering a table by using a list of items.
 * Updatable by a state change containing all items.
 */
class SimpleListComponent extends AbstractTableBasedComponent {
    static MESSAGES = {reloadSuccessful: "Datele au fost reîncărcate!"};
    /**
     * @type {CrudRepository}
     */
    repository;

    /**
     * see also SimpleListOptions
     */
    constructor({
                    state,
                    view,
                    config: {
                        dontAutoInitialize,
                        ...restOfConfig
                    } = {},
                    ...options
                }) {
        super({state, view, config: {dontAutoInitialize: true, ...restOfConfig}, ...options});
        this.config = new SimpleListConfiguration(this.config);
        this.state = state ?? new SimpleListState();
        this.view = view ?? new SimpleListView({
            mustacheTableElemAdapter: this.mustacheTableElemAdapter,
            simpleListConfiguration: this.config
        });
        this.handleWithAny(["CREATE", "REPLACE", "DELETE"])
        this.repository = options.repository ?? new InMemoryCrudRepository(this.config.parsedItems);
        this.config.dontAutoInitialize = dontAutoInitialize ?? this.config.dontAutoInitialize;
        this._handleAutoInitialization();
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
        return this.init().then(this._handleSuccessfulReload.bind(this));
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
     * linking triggers to component's handlers (aka capabilities)
     *
     * @protected
     */
    _configureEvents() {
        console.log(`${this.constructor.name}._configureEvents`);
        this.view.$elem.on(this._appendNamespaceTo("click"),
            this._btnSelector("reload"), this, this.onReload);
    }

    /**
     * Replaces the state with the one loaded from repository.
     *
     * @return {Promise<[]>}
     * @protected
     */
    _reloadState() {
        return this._handleRepoErrors(this.repository.findAll())
            .then((items) => {
                console.log(`${this.constructor.name}._reloadState items:\n`, JSON.stringify(items));
                this.simpleListState.updateAll(items);
                return items;
            });
    }

    /**
     * @return {SimpleListState}
     */
    get simpleListState() {
        return this.state;
    }
}