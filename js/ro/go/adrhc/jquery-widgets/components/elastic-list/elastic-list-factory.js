class ElasticListFactory {
    /**
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string}
     * @param items {IdentifiableEntity[]}
     * @param repository {CrudRepository}
     * @param crudListState {CrudListState}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param simpleListView {SimpleListView}
     * @param addNewRowsAtEnd {boolean} whether to append or prepend
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, mustacheTableElemAdapter: MustacheTableElemAdapter): IdentifiableRowComponent}
     * @return {ElasticListComponent}
     */
    static create(tableIdOrJQuery, bodyRowTmplId, {
        items = [],
        repository = new InMemoryCrudRepository(new EntityHelper(), items),
        addNewRowsAtEnd,
        crudListState = new CrudListState(addNewRowsAtEnd),
        mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId),
        simpleListView = new SimpleListView(mustacheTableElemAdapter),
        idRowCompFactoryFn = (item, afterItemId, mustacheTableElemAdapter) => {
            const idRowComp = SimpleRowFactory.createIdentifiableRow({
                mustacheTableElemAdapter,
                bodyRowTmplId,
                tableRelativePositionOnCreate: addNewRowsAtEnd ? "append" : "prepend"
            });
            idRowComp.simpleRowState.update(item, "CREATE", afterItemId);
            return idRowComp;
        }
    }) {
        return new ElasticListComponent(repository, crudListState, simpleListView, idRowCompFactoryFn);
    }
}