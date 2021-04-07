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
     * @param {string|jQuery<HTMLTableElement>} elemIdOrJQuery
     * @param {string} rowPositionOnCreate
     * @param bodyTmplHtml
     * @param rowDataId
     * @param dontAutoInitialize
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
     * @param compositeBehaviour
     * @param childCompFactories
     * @param parentComponent
     */
    constructor({
                    elemIdOrJQuery,
                    bodyRowTmplId,
                    bodyRowTmplHtml,
                    bodyTmplHtml,
                    rowDataId,
                    rowPositionOnCreate,
                    childProperty,
                    dontAutoInitialize,
                    config = ComponentConfiguration.configWithOverrides(elemIdOrJQuery, {
                        bodyRowTmplId,
                        bodyRowTmplHtml,
                        bodyTmplHtml,
                        rowDataId,
                        rowPositionOnCreate,
                        childProperty,
                        dontAutoInitialize
                    }),
                    items = typeof config.items === "string" ? JSON.parse(config.items) : config.items ?? [],
                    repository = new InMemoryCrudRepository(items),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, config),
                    state = new SimpleListState(),
                    view = new SimpleListView(mustacheTableElemAdapter),
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent
                }) {
        // the "super" missing parameters (e.g. bodyRowTmplId) are included in "config" or they are
        // simply intermediate values (e.g. elemIdOrJQuery is used to compute mustacheTableElemAdapter)
        super({
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent,
            config: config.dontAutoInitializeOf()
        });
        this.config = config; // the "config" set by "super" is different (see line above)
        this.handleWithAny(["CREATE", "REPLACE", "DELETE"])
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
}