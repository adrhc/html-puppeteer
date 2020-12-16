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
        this.swappingState.switchTo(new SelectableSwappingData(item, context));
        this.collectAnotherStateChanges(this.swappingState.stateChanges)
    }
}