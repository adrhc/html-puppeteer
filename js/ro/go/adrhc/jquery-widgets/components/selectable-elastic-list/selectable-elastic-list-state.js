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
        // must use "==" to convert string to number
        if (this.swappingState.swappingDetails
            && this.swappingState.swappingDetails.data
            && this.swappingState.swappingDetails.data.item
            && EntityUtils.prototype.idsAreEqual(id, this.swappingState.swappingDetails.data.item.id)
            && context == this.swappingState.swappingDetails.data.context) {
            return;
        }
        this.swappingState.switchTo(new SelectableSwappingData(item, context));
        this.collectAnotherStateChanges(this.swappingState.stateChanges)
    }
}