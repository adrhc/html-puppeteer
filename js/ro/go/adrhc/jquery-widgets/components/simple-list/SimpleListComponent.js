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
     * @param {SimpleListOptions=} options are the programmatically (javascript) passed options
     * @return {SimpleListComponent|Promise<StateChange[]>}
     */
    constructor(options) {
        super(SimpleListOptions.of(options));
        this.handleWithAny(["CREATE", "REPLACE", "DELETE"])
        this.repository = options.repository ?? new InMemoryCrudRepository(this._configItemsOf(options));
        this._handleAutoInitialization();
    }

    /**
     * @param {SimpleListOptions} options are the programmatically (javascript) passed options
     * @return {IdentifiableEntity[]|Array} is options.items or (if empty) the items specified e.g. in HTML with "data-items"
     * @protected
     */
    _configItemsOf(options) {
        const configItems = this.simpleListConfiguration?.items ?? [];
        return options.items ?? (typeof configItems === "string" ? JSON.parse(configItems) : configItems);
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
     * @return {SimpleListConfiguration}
     */
    get simpleListConfiguration() {
        return this.config
    }

    /**
     * @return {SimpleListState}
     */
    get simpleListState() {
        return this.state;
    }
}