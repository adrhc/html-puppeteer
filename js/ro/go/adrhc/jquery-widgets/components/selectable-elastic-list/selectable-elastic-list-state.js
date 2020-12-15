/**
 * SelectableElasticListState extends CrudListState (which extends SimpleListState) and OnOffState
 */
class SelectableElasticListState extends CrudListState {
    onOffState = new OnOffState("SELECT");

    /**
     * @param id {numeric|string}
     */
    switchTo(id) {
        const item = this.findById(id);
        this.onOffState.switchTo(item);
        this.collectAnotherStateChanges(this.onOffState.stateChanges)
    }
}