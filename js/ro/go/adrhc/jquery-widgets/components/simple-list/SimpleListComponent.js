/**
 * A component rendering a table by using a list of items.
 * Updatable by a state change containing all items.
 */
class SimpleListComponent extends AbstractTableBasedComponent {
    static DEFAULT_POSITION = "prepend";
    static MESSAGES = {reloadSuccessful: "Datele au fost reîncărcate!"};
    /**
     * @type {boolean|undefined}
     */
    dontAutoInitialize;
    /**
     * @type {CrudRepository}
     */
    repository;
    /**
     * @type {"append", "prepend"}
     */
    rowPositionOnCreate;

    /**
     * This is a computed property, never to be overridden by this.defaults.
     *
     * @return {boolean} this.rowPositionOnCreate === "append"
     */
    get newItemsGoLast() {
        return this.rowPositionOnCreate === "append";
    }

    /**
     * This is the computed/runtime value of items.
     *
     * @return {[]}
     */
    get parsedItems() {
        const configItems = this.defaults.items ?? [];
        return typeof configItems === "string" ? JSON.parse(configItems) : configItems;
    }

    /**
     * @return {SimpleListState}
     */
    get simpleListState() {
        return this.state;
    }

    constructor(abstractComponentOptions) {
        super({
            dontAutoInitialize: true,
            ...abstractComponentOptions
        });
        this.rowPositionOnCreate = this.defaults.rowPositionOnCreate ?? SimpleListComponent.DEFAULT_POSITION;
        this.repository = this.defaults.repository ?? this._createCrudRepository();
        this.handleWithAny(["CREATE", "REPLACE", "DELETE"])
        this.dontAutoInitialize = this._dontAutoInitializeOf(abstractComponentOptions);
        this._handleAutoInitialization();
    }

    /**
     * @return {EventsBinderConfigurer<SimpleListComponent>}
     * @protected
     */
    _createEventsBinderConfigurer() {
        return new SimpleListEventsBinder(this);
    }

    /**
     * @return {CrudRepository}
     * @protected
     */
    _createCrudRepository() {
        return new InMemoryCrudRepository(this.parsedItems, this.defaults.responseConverter, this.defaults.requestConverter);
    }

    /**
     * @return {StateHolder}
     * @protected
     */
    _createStateHolder() {
        return new SimpleListState(this.defaults);
    }

    /**
     * @return {SimpleListView}
     * @protected
     */
    _createView() {
        return new SimpleListView({
            rowPositionOnCreate: SimpleListComponent.DEFAULT_POSITION,
            ...this.defaults
        });
    }

    /**
     * Although very similar to init, reload is another scenario, that's why it's ok to have its own method.
     *
     * @return {Promise<StateChange[]>}
     * @protected
     */
    reload() {
        this.reset();
        return this.init().then(this._handleSuccessfulReload.bind(this));
    }

    /**
     * Called after successfully reloading (i.e. after reload call).
     *
     * @private
     */
    _handleSuccessfulReload() {
        alert(SimpleListComponent.MESSAGES.reloadSuccessful);
    }

    /**
     * Replaces the state with the one loaded from repository.
     *
     * @return {Promise<[]>}
     * @protected
     */
    _initializeState() {
        return this._handleRepoErrors(this.repository.findAll())
            .then((items) => {
                console.log(`${this.constructor.name}._initializeState items:\n`, JSON.stringify(items));
                this.simpleListState.replaceAll(items);
                return items;
            });
    }
}