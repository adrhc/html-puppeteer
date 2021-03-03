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
     * @param {CrudRepository} repository
     * @param {SimpleListState} state
     * @param {SimpleListView} view
     * @param {ComponentConfiguration} [config]
     */
    constructor(repository, state, view, config) {
        super(state, view, config);
        this.stateChangesDispatcher.prependKnownChangeTypes("CREATE", "REPLACE", "DELETE");
        this.simpleListState = state;
        this.repository = repository;
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
        return this.init().then(this._handleReloadSuccessful);
    }

    _handleReloadSuccessful() {
        alert(SimpleListComponent.MESSAGES.reloadSuccessful);
    }

    /**
     * @return {Promise<*>}
     */
    _reloadState() {
        return this._handleRepoErrors(this.repository.findAll())
            .then((items) => {
                console.log(`${this.constructor.name}._reloadState items:\n`, JSON.stringify(items));
                this._updateState(items);
                return items;
            });
    }

    /**
     * @param {[]} items
     * @protected
     */
    _updateState(items) {
        this.simpleListState.updateAll(items);
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @protected
     */
    configureEvents() {
        console.log(`${this.constructor.name}.configureEvents`);
        this.view.$elem.on(this._appendNamespaceTo("click"),
            this._btnSelector("reload"), this, this.onReload);
    }
}