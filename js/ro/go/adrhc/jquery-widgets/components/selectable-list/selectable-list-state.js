/**
 * SelectableListState extends CrudListState (which extends SimpleListState) and SwappingState
 *
 * SwappingState collects state changes as follows:
 *      StateChange.requestType = SwappingState.requestType (defaults to "SWAP")
 *      StateChange.data = SwappingDetails
 * SelectableListState.swappingState collects state changes as follows:
 *      StateChange.swappingDetails.data = SelectableSwappingData
 */
class SelectableListState extends CrudListState {
    /**
     * @type {SwappingState}
     */
    swappingState;

    /**
     * @param [swappingState] {SwappingState}
     * @param [newItemsGoToTheEndOfTheList] {boolean}
     */
    constructor(swappingState, newItemsGoToTheEndOfTheList) {
        super(newItemsGoToTheEndOfTheList);
        this.swappingState = swappingState ? swappingState : new SwappingState();
    }

    /**
     * @param id {numeric|string}
     * @param context is some context data
     * @return {boolean} whether the switch actually happened or not
     */
    switchTo(id, context) {
        const previousSelectableSwappingData = this.currentSelectableSwappingData;
        const item = this.findById(id);
        const newSelectableSwappingData = new SelectableSwappingData(item, context);
        if (newSelectableSwappingData.similarTo(previousSelectableSwappingData)) {
            console.log(`switch cancelled:\n${JSON.stringify(previousSelectableSwappingData)}\nis similar to\n${JSON.stringify(newSelectableSwappingData)}`)
            return false;
        }
        const switched = this.swappingState.switchTo(newSelectableSwappingData);
        if (switched) {
            this._doAfterSwitch(previousSelectableSwappingData, newSelectableSwappingData)
        }
        return switched;
    }

    /**
     * @return {boolean} whether the switch off actually happened or not
     */
    switchToOff() {
        const previousSelectableSwappingData = this.currentSelectableSwappingData;
        const switched = this.swappingState.switchOff();
        if (switched) {
            this._doAfterSwitch(previousSelectableSwappingData, undefined)
        }
        return switched;
    }

    /**
     * reload last swapped off item
     *
     * @param previousSelectableSwappingData {SelectableSwappingData|undefined}
     * @param newSelectableSwappingData {SelectableSwappingData|undefined}
     * @protected
     */
    _doAfterSwitch(previousSelectableSwappingData, newSelectableSwappingData) {
        if (!!previousSelectableSwappingData) {
            this._reloadLastSwappedOffItem();
        }
        this.collectByConsumingStateChanges(this.swappingState.stateChanges)
    }

    /**
     * When switching after a save operation the current swappingStateChange might contain a stale item.
     * The switch events consumer might need the updated item's value so we need to reload it.
     * When the item is a transient one it make no sense to reload it.
     *
     * @protected
     */
    _reloadLastSwappedOffItem() {
        const swappingStateChange = this.swappingState.findFirstFromNewest((swappingStateChange) => swappingStateChange.data.isPrevious);
        if (!swappingStateChange) {
            // error: no isPrevious (true) state change
            throw "found no isPrevious = true state change!";
        }
        /**
         * swappingStateChange.data is {SwappingDetails}
         * @type {SelectableSwappingData}
         */
        const selectableSwappingData = swappingStateChange.data.data;
        if (selectableSwappingData.reloadedId != null) {
            // error: reloadedId != null
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
        selectableSwappingData.item = this.findById(selectableSwappingData.reloadedId);
    }

    reset() {
        super.reset();
        this.swappingState.reset();
    }

    /**
     * @return {SelectableSwappingData|undefined}
     */
    get currentSelectableSwappingData() {
        const swappingDetails = this.swappingState.swappingDetails;
        return swappingDetails && swappingDetails.data ? swappingDetails.data : undefined;
    }
}