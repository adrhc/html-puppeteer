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
            this._reloadItemOnAllSwappings(true);
            this.collectByConsumingStateChanges(this.swappingState.stateChanges)
        }
    }

    /**
     * @param mustBePrevious means swappingDetails.isPrevious must be true
     * @protected
     */
    _reloadItemOnAllSwappings(mustBePrevious = true) {
        this.swappingState.peekAll(true)
            .forEach(stateChange => this._reloadItemOnSwapping(stateChange, mustBePrevious));
    }

    /**
     * restore item state on cancelled swapping (aka "previous" or switched to "off" swapping)
     *
     * @param swappingStateChange {StateChange}
     * @param mustBePrevious {boolean|undefined}
     * @protected
     */
    _reloadItemOnSwapping(swappingStateChange, mustBePrevious = true) {
        /**
         * @type {SwappingDetails}
         */
        const swappingDetails = swappingStateChange.data;
        /**
         * @type {SelectableSwappingData}
         */
        const selectableSwappingData = swappingDetails.data;
        // id could be undefined when previously switched to undefined (to switch off the previous)
        const itemId = selectableSwappingData.itemId;
        if (swappingDetails.isPrevious && !!itemId) {
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