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
        if (this._isEqualToCurrent(newSelectableSwappingData)) {
            return;
        }
        this.swappingState.switchTo(newSelectableSwappingData);
        this.reloadItemOnAllSwappings(true);
        this.collectByConsumingStateChanges(this.swappingState.stateChanges)
    }

    /**
     * @param mustBePrevious means swappingDetails.isPrevious must bu true
     */
    reloadItemOnAllSwappings(mustBePrevious = true) {
        this.swappingState.peekAll(true)
            .forEach(stateChange => this.reloadItemOnSwapping(stateChange, mustBePrevious));
    }

    /**
     * @param swappingStateChange {StateChange|undefined}
     * @param mustBePrevious {boolean|undefined}
     */
    reloadItemOnSwapping(swappingStateChange, mustBePrevious = true) {
        const swappingDetails = swappingStateChange.data;
        const selectableSwappingData = swappingDetails.data;
        if (swappingDetails.isPrevious && selectableSwappingData.item) {
            selectableSwappingData.reloadedId = selectableSwappingData.item.id;
            selectableSwappingData.item = this.findById(selectableSwappingData.item.id);
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