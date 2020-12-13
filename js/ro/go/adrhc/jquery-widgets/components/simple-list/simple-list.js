class SimpleListComponent extends AbstractTableBasedComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SimpleListState}
     * @param view {SimpleListView}
     */
    constructor(mustacheTableElemAdapter,
                repository, state, view) {
        super(mustacheTableElemAdapter, state, view);
        this.repository = repository;
    }

    /**
     * component initializer
     * @return {Promise<IdentifiableEntity[]>}
     */
    init() {
        return this.handleRepoErrors(this.repository.getAll())
            .then((items) => {
                console.log("TableEditorComponent items:\n", JSON.stringify(items));
                this.state.update(items);
                this.view.update(this.state.consumeStateChange());
                return items;
            });
    }
}