class ElasticListFactory {
    /**
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string}
     * @param items {IdentifiableEntity[]}
     * @param repository {CrudRepository}
     * @param crudListState {CrudListState}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param simpleListView {SimpleListView}
     * @param tableRelativePositionOnCreate {boolean}
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, mustacheTableElemAdapter: MustacheTableElemAdapter): IdentifiableRowComponent}
     * @return {ElasticListComponent}
     */
    static create(tableIdOrJQuery, bodyRowTmplId, {
        items = [],
        repository = new InMemoryCrudRepository(new EntityHelper(), items),
        tableRelativePositionOnCreate,
        crudListState = new CrudListState(tableRelativePositionOnCreate),
        mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId),
        simpleListView = new SimpleListView(mustacheTableElemAdapter),
        idRowCompFactoryFn = (item, afterItemId, mustacheTableElemAdapter) => {
            const idRowComp = SimpleRowFactory.createIdentifiableRow({
                mustacheTableElemAdapter,
                bodyRowTmplId,
                tableRelativePositionOnCreate
            });
            idRowComp.simpleRowState.update(item, "CREATE", afterItemId);
            return idRowComp;
        }
    }) {
        return new ElasticListComponent(repository, crudListState, simpleListView, idRowCompFactoryFn);
    }
}