/**
 * A component rendering a table by using a list of items.
 * Updatable by a state change containing all items.
 */
class SimpleListComponent extends AbstractTableBasedComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     */
    constructor(repository, state, view) {
        super(state, view);
        this.repository = repository;
        this.state = state;
    }

    /**
     * component initializer: (re)load data, configure events
     *
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        return this._reloadState().then(() => this.updateViewOnStateChanges());
    }

    /**
     * @return {Promise<*>}
     * @protected
     */
    _reloadState() {
        return this._handleRepoErrors(this.repository.getAll())
            .then((items) => {
                console.log(`${this.constructor.name} items:\n`, JSON.stringify(items));
                this.state.updateAll(items);
                return items;
            });
    }

    /**
     * called by AbstractComponent.updateViewOnStateChange
     *
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnUPDATE_ALL(stateChange) {
        return this.view.update(stateChange);
    }
}