class CrudListComponent extends SimpleListComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     */
    constructor(mustacheTableElemAdapter,
                repository, state, view) {
        super(mustacheTableElemAdapter, repository, state, view);
    }

}