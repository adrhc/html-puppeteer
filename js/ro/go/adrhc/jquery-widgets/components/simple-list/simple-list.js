/**
 * A component rendering a table by using a list of items.
 * Updatable by a state change containing all items.
 */
class SimpleListComponent extends AbstractTableBasedComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {SimpleListState}
     * @param view {SimpleListView}
     */
    constructor(repository, state, view) {
        super(state, view);
        this.simpleListState = state;
        this.repository = repository;
    }

    /**
     * @return {Promise<*>}
     */
    _reloadState() {
        return this._handleRepoErrors(this.repository.findAll())
            .then((items) => {
                console.log(`${this.constructor.name} items:\n`, JSON.stringify(items));
                // reset must be before updateAll because it resets the state too!
                this.reset();
                this.simpleListState.updateAll(items);
                return items;
            });
    }

    /**
     * Although very similar to init, reload is another scenario, that's why it's ok to have its own method.
     *
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _reload() {
        return this.init(new ComponentInitConfig(true));
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
        simpleListComponent._reload();
    }

    /**
     * see also ElasticListComponent.updateViewOnCREATE
     *
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnUPDATE_ALL(stateChange) {
        return this.view.update(stateChange);
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