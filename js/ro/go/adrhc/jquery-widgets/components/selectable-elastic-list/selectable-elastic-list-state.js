/**
 * SelectableElasticListState extends CrudListState (which extends SimpleListState) and OnOffState
 */
class SelectableElasticListState extends CrudListState {
    onOffState = new OnOffState("SELECT");

    /**
     * @param id {numeric|string}
     * @param context is some context data
     */
    switchTo(id, context) {
        const item = this.findById(id);
        this.onOffState.switchTo({item, context});
        this.collectAnotherStateChanges(this.onOffState.stateChanges)
    }
}