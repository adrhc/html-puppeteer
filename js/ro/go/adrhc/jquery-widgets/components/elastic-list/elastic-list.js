class ElasticListComponent extends SimpleListComponent {
    /**
     * @type {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, mustacheTableElemAdapter: MustacheTableElemAdapter): IdentifiableRowComponent}
     */
    idRowCompFactoryFn;

    /**
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, mustacheTableElemAdapter: MustacheTableElemAdapter): IdentifiableRowComponent}
     */
    constructor(repository, state, view, idRowCompFactoryFn) {
        super(repository, state, view);
        this.idRowCompFactoryFn = idRowCompFactoryFn;
    }

    updateViewOnUPDATE_ALL(stateChange) {
        /**
         * @type {Array}
         */
        const items = stateChange.data;
        items.forEach((item, index) => this.addChildComponent(
            this.idRowCompFactoryFn(item,
                index === 0 ? undefined : items[index - 1],
                this.tableBasedView.tableAdapter)
        ));
        return this.initKids();
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {Promise<PositionStateChange>}
     * @private
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
        return Promise.resolve(stateChange);
    }
}