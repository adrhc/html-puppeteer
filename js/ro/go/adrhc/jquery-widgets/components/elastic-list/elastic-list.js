/**
 * A SimpleListComponent
 */
class ElasticListComponent extends SimpleListComponent {
    /**
     * create the row component and set its state
     *
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
        this.crudListState = state;
        this.idRowCompFactoryFn = idRowCompFactoryFn;
    }

    /**
     * Creates a component for each item, stores it, then init all stored components.
     *
     * @return {Promise<Array<StateChange>[]>}
     */
    initKids() {
        this.addChildComponents(this._createChildComponents(this.crudListState.items));
        return super.initKids();
    }

    /**
     * This does what this.initKids() does but for only 1 item.
     *
     * Reason: the whole purpose of this component is to allow one to manually manipulate the
     * state (aka, by using doWithState) so one might simply add a new item in which case the
     * associated view must be created completely (including calling initKids); this is very
     * similar to init() but for 1 row only.
     *
     * see also SimpleListComponent.updateViewOnUPDATE_ALL
     *
     * @param stateChange {PositionStateChange}
     * @return {Promise}
     */
    updateViewOnCREATE(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnCREATE:\n${JSON.stringify(stateChange)}`);
        return this.addChildComponents(this._createChildComponent(stateChange)).init();
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
        const removeKidAfterProcessing = stateChange.requestType === "DELETE";
        return this.processStateChangeWithKids(stateChange, this._kidsInterestedInStateChangeFilter(stateChange), removeKidAfterProcessing);
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     * When this.extractAllInputValues exists than this.extractAllEntities must use it instead of using super.extractAllEntities!
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.compositeBehaviour.extractAllEntities(useOwnerOnFields);
    }

    /**
     * @param stateChange {PositionStateChange}
     * @return {function(kid: IdentifiableRowComponent): boolean} a predicate for kid.id = stateChange...id
     * @protected
     */
    _kidsInterestedInStateChangeFilter(stateChange) {
        return (kid) => EntityUtils.haveSameId(kid.simpleRowState.rowState, stateChange.data);
    }

    /**
     * Creates child components from items while computing the afterItemId based on items ordering.
     *
     * @param items {Array}
     * @return {IdentifiableRowComponent[]}
     * @protected
     */
    _createChildComponents(items) {
        return items.map((item, index) => {
            const afterItemId = index === 0 ? undefined : items[index - 1].id;
            return this.idRowCompFactoryFn(item, afterItemId, this.tableBasedView.tableAdapter);
        });
    }

    /**
     * @param positionStateChange {PositionStateChange}
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _createChildComponent(positionStateChange) {
        return this.idRowCompFactoryFn(positionStateChange.data, positionStateChange.afterItemId, this.tableBasedView.tableAdapter);
    }
}