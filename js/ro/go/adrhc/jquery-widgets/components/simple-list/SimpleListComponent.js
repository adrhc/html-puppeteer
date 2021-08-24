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
     */
    constructor(options= new SimpleListOptions()) {
        super(SimpleListComponent._optionsWithDefaultsOf(options, true));
        this.handleWithAny(["CREATE", "REPLACE", "DELETE"])
        this.repository = options.repository ?? new InMemoryCrudRepository(this._configItemsOf(options));
        return this._handleAutoInitialization(options.forceDontAutoInitialize);
    }

    /**
     * @param {SimpleListOptions} options are the programmatically (javascript) passed options
     * @param {boolean=} forceDontAutoInitialize
     * @return {SimpleListOptions} is the options with the defaults applied
     * @protected
     */
    static _optionsWithDefaultsOf(options, forceDontAutoInitialize = options.forceDontAutoInitialize) {
        let config = options.config ?? SimpleListConfiguration.of(options);
        return _.defaults(new SimpleListOptions(), {
            config,
            state: options.state ?? new SimpleListState(),
            view: options.view ?? SimpleListView.of(options, config),
            forceDontAutoInitialize
        }, options);
    }

    /**
     * @param {SimpleListOptions} options are the programmatically (javascript) passed options
     * @return {IdentifiableEntity[]|Array} is options.items or (if empty) the items specified e.g. in HTML with "data-items"
     * @protected
     */
    _configItemsOf(options) {
        if (options.items) {
            return options.items;
        } else if (typeof this.simpleListConfiguration.items === "string") {
            return JSON.parse(this.simpleListConfiguration.items);
        } else {
            // SimpleListConfiguration.configOf already parse items JSON (jquery default behaviour for $.data())
            return this.simpleListConfiguration.items ?? [];
        }
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
                this.simpleListState.updateAll(items);
                return items;
            });
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