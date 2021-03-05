/**
 * SelectableListState extends CrudListState (which extends SimpleListState) and RowSwappingState
 *
 * RowSwappingState collects state changes as follows:
 *      StateChange.changeType = RowSwappingState.changeType (defaults to "SWAP")
 *      StateChange.data = SwappingDetails
 * SelectableListState.swappingState collects state changes as follows:
 *      StateChange.swappingDetails.data = EntityRowSwap
 */
class SelectableListState extends CrudListState {
    /**
     * @type {RowSwappingState}
     */
    swappingState;

    /**
     * @param {*} [initialState]
     * @param {function(): IdentifiableEntity} [newEntityFactoryFn]
     * @param {boolean} [newItemsGoToTheEndOfTheList]
     * @param {TaggingStateHolder} [swappingState]
     */
    constructor({
                    initialState,
                    newEntityFactoryFn,
                    newItemsGoToTheEndOfTheList,
                    swappingState = new RowSwappingState()
                }) {
        super({initialState, newEntityFactoryFn, newItemsGoToTheEndOfTheList});
        this.swappingState = swappingState;
    }

    /**
     * @param id {numeric|string}
     * @param context is some context data
     * @return {boolean} whether the switch actually happened or not
     */
    switchTo(id, context) {
        if (id == null) {
            console.log(`${this.constructor.name}, context = ${context}, id is null! switching off`)
            return this.switchToOff();
        }
        const item = this.findById(id);
        if (!item) {
            console.log(`${this.constructor.name}, context = ${context}, no item found for id = ${id}! switching off`)
            return this.switchToOff();
        }
        const previousEntityRowSwap = this.swappingState.currentState;
        const newEntityRowSwap = new EntityRowSwap(new EntityRow(item, this.items.indexOf(item)), context);
        const switched = !!this.swappingState.switchTo(newEntityRowSwap);
        if (switched) {
            this._doAfterSwitch(previousEntityRowSwap, newEntityRowSwap)
        }
        return switched;
    }

    /**
     * @return {boolean} whether the switch off actually happened or not
     */
    switchToOff() {
        const previousEntityRowSwap = this.swappingState.currentState;
        const switched = !!this.swappingState.switchOff();
        if (switched) {
            this._doAfterSwitch(previousEntityRowSwap)
        }
        return switched;
    }

    /**
     * reload last swapped off item
     *
     * @param {EntityRowSwap} previousEntityRowSwap
     * @param {EntityRowSwap|undefined} [newEntityRowSwap]
     * @protected
     */
    _doAfterSwitch(previousEntityRowSwap, newEntityRowSwap) {
        if (previousEntityRowSwap != null) {
            this._reloadLastSwappedOffItem();
        }
        this.stateChanges.collectByConsumingChanges(this.swappingState.stateChanges)
    }

    /**
     * When switching after a save operation the current swappingStateChange might contain a stale item.
     * The switch events consumer might need the updated item's value so we need to reload it.
     * When the item is a transient one it make no sense to reload it.
     *
     * @protected
     */
    _reloadLastSwappedOffItem() {
        const swappingStateChange = this.swappingState.stateChanges
            .findFirstFromNewest((swappingStateChange) => swappingStateChange.data.isPrevious);
        if (!swappingStateChange) {
            // error: no isPrevious (true) state change
            console.error("found no isPrevious = true state change!");
            throw "found no isPrevious = true state change!";
        }
        /**
         * swappingStateChange.data is {SwappingDetails}
         * @type {EntityRowSwap}
         */
        const selectableSwappingData = swappingStateChange.data.data;
        if (selectableSwappingData.reloadedId != null) {
            // error: reloadedId != null
            console.error(`reloadedId (${selectableSwappingData.reloadedId}) != null:\n${JSON.stringify(swappingStateChange)}`);
            throw `reloadedId (${selectableSwappingData.reloadedId}) != null:\n${JSON.stringify(swappingStateChange)}`;
        }
        if (selectableSwappingData.itemId == null) {
            // skip null itemId
            return;
        }
        // remember the reloaded id
        selectableSwappingData.reloadedId = selectableSwappingData.itemId;
        // when reloading the "transient" id the result might be undefined when
        // the transient record was removed (after being persisted or discarded)
        selectableSwappingData.entityRow = this.findById(selectableSwappingData.reloadedId);
    }

    reset() {
        super.reset();
        this.swappingState.reset();
    }

    /**
     * @param {string|number} id
     */
    findById(id) {
        return EntityUtils.findById(id, this.items);
    }
}