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
    swappingState = new SwappingState();

    /**
     * @param id {numeric|string}
     * @param context is some context data
     */
    switchTo(id, context) {
        const item = this.findById(id);
        const newSelectableSwappingData = new SelectableSwappingData(item, context);
        if (!this._isEqualToCurrent(newSelectableSwappingData)) {
            this.swappingState.switchTo(newSelectableSwappingData);
            this._reloadAllSwappedOffItems(true);
            this.collectByConsumingStateChanges(this.swappingState.stateChanges)
        }
    }

    /**
     * @protected
     */
    _reloadAllSwappedOffItems() {
        this.swappingState.peekAll(true)
            .filter(swappingStateChange => swappingStateChange.data.isPrevious)
            .forEach(stateChange => this._reloadSwappedOffItem(stateChange));
    }

    /**
     * restore item state on cancelled swapping (aka "previous" or switched to "off" swapping)
     *
     * @param swappingStateChange {StateChange}
     * @protected
     */
    _reloadSwappedOffItem(swappingStateChange) {
        /**
         * swappingStateChange.data is SwappingDetails
         * @type {SelectableSwappingData}
         */
        const selectableSwappingData = swappingStateChange.data.data;
        // itemId could be undefined when "previous" item is undefined
        // makes sense to switch to undefined (aka undefined item): it is used to switch off the current selection
        const itemId = selectableSwappingData.itemId;
        if (!!itemId) {
            selectableSwappingData.reloadedId = itemId;
            selectableSwappingData.item = this.findById(itemId);
        }
    }

    /**
     * @param newSelectableSwappingData {SelectableSwappingData}
     * @return {boolean}
     * @protected
     */
    _isEqualToCurrent(newSelectableSwappingData) {
        return this.currentSelectableSwappingData
            && this.currentSelectableSwappingData.equals(newSelectableSwappingData);
    }

    resetSwappingState() {
        this.swappingState.reset();
    }

    /**
     * @return {SelectableSwappingData|undefined}
     */
    get currentSelectableSwappingData() {
        return this.swappingState.swappingDetails && this.swappingState.swappingDetails.data
            ? this.swappingState.swappingDetails.data : undefined;
    }
}