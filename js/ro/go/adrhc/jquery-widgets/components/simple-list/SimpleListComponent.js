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
     * @param {SimpleListOptions} options
     */
    constructor(options) {
        super(SimpleListComponent._optionsWithDefaults(options, true));
        this.handleWithAny(["CREATE", "REPLACE", "DELETE"])
        this.repository = options.repository ?? new InMemoryCrudRepository(this._configItemsOf(options));
        return this._handleAutoInitialization();
    }

    /**
     * @param {SimpleListOptions} options
     * @param {boolean} forceDontAutoInitialize
     * @return {SimpleListOptions}
     * @protected
     */
    static _optionsWithDefaults(options, forceDontAutoInitialize) {
        const defaultDontAutoInitialize = AbstractComponent._canConstructChildishBehaviour(options.childishBehaviour, options.parentComponent);
        const config = options.config ?? SimpleListConfiguration
            .configOf(options.elemIdOrJQuery, {dontAutoInitialize: defaultDontAutoInitialize})
            .overwriteWith(ObjectUtils.objectWithPropertiesOf(options, ["bodyRowTmplId", "bodyRowTmplHtml",
                "bodyTmplHtml", "rowDataId", "rowPositionOnCreate", "childProperty", "dontAutoInitialize"]));
        const mustacheTableElemAdapter = options.mustacheTableElemAdapter ?? new MustacheTableElemAdapter(options.elemIdOrJQuery, config);
        return _.defaults({
            config,
            state: options.state ?? new SimpleListState(),
            view: options.view ?? new SimpleListView(mustacheTableElemAdapter),
            forceDontAutoInitialize
        }, options);
    }

    /**
     * @param {SimpleListOptions} options
     * @return {IdentifiableEntity[]|Array}
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