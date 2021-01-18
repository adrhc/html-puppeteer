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
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        // reload state
        return this._reloadState()
            // update view
            .then(() => this.updateViewOnStateChanges())
            // init kids
            .then((stateChanges) => this.initKids().then(() => stateChanges));
    }

    /**
     * @return {Promise<*>}
     * @protected
     */
    _reloadState() {
        return this._handleRepoErrors(this.repository.findAll())
            .then((items) => {
                console.log(`${this.constructor.name} items:\n`, JSON.stringify(items));
                this.simpleListState.updateAll(items);
                return items;
            });
    }

    /**
     * It won't do what init() does: e.g. it won't initKids
     * or configure events, only init() should do that!
     *
     * Reason: this competes with init() on initKids() call; should this method call also initKids()
     * then init() shouldn't do it or other way around. There's no reason to manually update the
     * state (aka, by using doWithState) but if indeed there is one then the caller must take care
     * of everything (including calling initKids)
     *
     * see also ElasticListComponent.updateViewOnCREATE
     *
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnUPDATE_ALL(stateChange) {
        return this.view.update(stateChange);
    }
}