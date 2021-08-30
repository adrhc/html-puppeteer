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
                    dontAutoInitialize,
                    ...restOfOptions
                }) {
        super({state, view, dontAutoInitialize: true, ...restOfOptions});
        this.state = state ?? new SimpleListState();
        this.view = view ?? new SimpleListView(this);
        this.handleWithAny(["CREATE", "REPLACE", "DELETE"])
        this.repository = this.repository ?? new InMemoryCrudRepository(this.parsedItems);
        this.dontAutoInitialize = dontAutoInitialize ?? this.view.booleanData("dontAutoInitialize");
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
                this.simpleListState.replaceAll(items);
                return items;
            });
    }

    /**
     * This is the computed/runtime value of items.
     *
     * @return {[]}
     */
    get parsedItems() {
        const configItems = this.items ?? [];
        return typeof configItems === "string" ? JSON.parse(configItems) : configItems;
    }

    /**
     * @return {boolean|undefined} this.simpleListConfiguration?.rowPositionOnCreate === "append"
     */
    get newItemsGoLast() {
        return this.rowPositionOnCreate == null ? undefined : this.rowPositionOnCreate === "append";
    }

    /**
     * @return {SimpleListState}
     */
    get simpleListState() {
        return this.state;
    }
}