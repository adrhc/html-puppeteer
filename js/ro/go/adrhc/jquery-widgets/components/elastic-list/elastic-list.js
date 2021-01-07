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
        const kids = items.map((item, index) => this.idRowCompFactoryFn(item,
            index === 0 ? undefined : items[index - 1], this.tableBasedView.tableAdapter));
        this.addChildComponent(kids);
        return this.initKids();
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {Promise<PositionStateChange>}
     * @private
     */
    updateViewOnCREATE(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnCREATE:\n${JSON.stringify(stateChange)}`);
        const idRowComp = this.idRowCompFactoryFn(stateChange.data, stateChange.afterItemId, this.tableBasedView.tableAdapter);
        this.addChildComponent(idRowComp);
        return idRowComp.updateViewOnStateChanges();
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
        return this.processKids(stateChange, this.kidsFilterOf(stateChange), stateChange.requestType === "DELETE");
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {function(kid: IdentifiableRowComponent): boolean}
     */
    kidsFilterOf(stateChange) {
        return (kid) => EntityUtils.haveSameId(kid.simpleRowState.rowState, stateChange.data);
    }
}