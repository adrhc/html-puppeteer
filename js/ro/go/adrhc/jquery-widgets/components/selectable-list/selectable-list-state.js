/**
 * SelectableListState extends CrudListState (which extends SimpleListState) and SwappingState
 *
 * from SwappingState:
 *      StateChange.requestType = this.requestType
 *      StateChange.data = SwappingDetails
 * from here:
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
        this.collectAnotherStateChanges(this.swappingState.stateChanges)
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
     * @param swappingStateChange {StateChange|undefined}
     * @param mustBePrevious {boolean|undefined}
     */
    reloadItemOnSwapping(swappingStateChange, mustBePrevious = true) {
        const swappingDetails = swappingStateChange.data;
        const selectableSwappingData = swappingDetails.data;
        if (swappingDetails.isPrevious && selectableSwappingData.item) {
            selectableSwappingData.item = this.findById(selectableSwappingData.item.id);
        }
    }

    /**
     * @return {SelectableSwappingData|undefined}
     */
    get currentSelectableSwappingData() {
        return this.swappingState.swappingDetails && this.swappingState.swappingDetails.data
            ? this.swappingState.swappingDetails.data : undefined;
    }
}