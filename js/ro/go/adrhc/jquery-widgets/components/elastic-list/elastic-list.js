/**
 * A SimpleListComponent
 */
class ElasticListComponent extends SimpleListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param idRowCompFactoryFn {function(identifiableEntity: IdentifiableEntity, afterItemId: number|string, elasticListComponent: ElasticListComponent): IdentifiableRowComponent}
     */
    constructor(repository, state, view, idRowCompFactoryFn) {
        super(repository, state, view);
        this.compositeBehaviour = new ElasticListCompositeBehaviour(this, idRowCompFactoryFn);
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
        return this.addChildComponents(this.elasticListCompositeBehaviour.createChildComponent(stateChange)).init();
    }

    /**
     * This is an ElasticListComponent where its view (SimpleListView) is able to handle a collection
     * of items but not a single item; for 1 item update we should delegate to it the update call.
     *
     * @param stateChange
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
        AssertionUtils.isFalse($.isArray(stateChange),
            `stateChange is an Array!\n${JSON.stringify(stateChange)}`)
        return this.processStateChangeWithKids(stateChange).then(() => stateChange);
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
     * @return {ElasticListCompositeBehaviour}
     */
    get elasticListCompositeBehaviour() {
        return this.compositeBehaviour;
    }
}