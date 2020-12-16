/**
 * SelectableElasticListState extends CrudListState (which extends SimpleListState) and SwappingState
 */
class SelectableElasticListState extends CrudListState {
    swappingState = new SwappingState();

    /**
     * @param id {numeric|string}
     * @param context is some context data
     */
    switchTo(id, context) {
        const item = this.findById(id);
        const newSelectableSwappingData = new SelectableSwappingData(item, context);
        if (this.swappingState.swappingDetails
            && this.swappingState.swappingDetails.data
            && this.swappingState.swappingDetails.data.equals(newSelectableSwappingData)) {
            return;
        }
        this.swappingState.switchTo(newSelectableSwappingData);
        this.collectAnotherStateChanges(this.swappingState.stateChanges)
    }
}