class SimpleListComponent extends AbstractTableComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SimpleListState}
     * @param view {SimpleListView}
     */
    constructor(mustacheTableElemAdapter,
                repository = new InMemoryCrudRepository(),
                state = new SimpleListState(),
                view = new SimpleListView(mustacheTableElemAdapter)) {
        super(mustacheTableElemAdapter, state, view);
        this.repository = repository;
    }

    /**
     * component initializer
     */
    init() {
        this.handleRepoErrors(this.repository.getAll())
            .then((items) => {
                console.log("TableEditorComponent items:\n", items);
                this.state.update(items);
                this.view.update(this.state.consumeStateChange());
            });
    }
}