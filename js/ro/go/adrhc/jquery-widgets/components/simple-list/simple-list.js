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
        super(view);
        this.repository = repository;
        this.state = state;
    }

    /**
     * component initializer
     * @return {Promise<IdentifiableEntity[]>}
     */
    init() {
        return this.handleRepoErrors(this.repository.getAll())
            .then((items) => {
                console.log("TableEditorComponent items:\n", JSON.stringify(items));
                this.state.updateAll(items);
                return this.updateOnStateChange();
            });
    }

    /**
     * @param stateChange {StateChange|undefined} used to update the view otherwise use state.consumeOne()
     * @return {Promise<StateChange>}
     */
    updateOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        return this.view.update(stateChange);
    }
}