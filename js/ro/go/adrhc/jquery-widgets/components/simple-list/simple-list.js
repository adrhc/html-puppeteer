/**
 * A component rendering a table by using a list of items.
 */
class SimpleListComponent extends AbstractTableBasedComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     */
    constructor(mustacheTableElemAdapter,
                repository, state, view) {
        super(mustacheTableElemAdapter, view);
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
                this.view.update(this.state.consumeOne());
                return items;
            });
    }
}