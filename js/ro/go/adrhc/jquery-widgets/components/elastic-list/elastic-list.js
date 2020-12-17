/**
 * A SimpleListComponent able to accept item-level state changes then updating the view at row level.
 * Uses a SimpleRowComponent to render the updated items (aka rows).
 */
class ElasticListComponent extends SimpleListComponent {
    /**
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param simpleRow {SimpleRowComponent}
     */
    constructor(repository, state, view, simpleRow) {
        super(repository, state, view);
        this.simpleRow = simpleRow;
    }

    /**
     * Offer the state for manipulation then update the view.
     *
     * @param stateUpdaterFn {function} receives a state {CrudListState} to update
     * @param delayViewUpdate {boolean} whether to (immediately) update the view based or not
     * @return {Promise<StateChange[]>}
     */
    doWithState(stateUpdaterFn, delayViewUpdate) {
        console.log("ElasticListComponent.doWithState: delayViewUpdate=", delayViewUpdate);
        stateUpdaterFn(this.state);
        if (delayViewUpdate) {
            return Promise.resolve(this.state.stateChanges.peekAll());
        }
        return this.updateViewOnStateChanges();
    }

    /**
     * Process multiple state changes to update the view.
     *
     * @param stateChanges {StateChange[]|undefined}
     * @return {Promise<StateChange[]>}
     */
    updateViewOnStateChanges(stateChanges) {
        stateChanges = stateChanges ? stateChanges : this.state.consumeAll();
        const promises = [];
        stateChanges
            .forEach(stateChange => {
                promises.push(this.updateViewOnStateChange(stateChange));
            });
        return Promise.allSettled(promises).then(() => stateChanges);
    }

    /**
     * Selects the view to update (aka re-render) or delegate to super.
     *
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        console.log("ElasticListComponent.updateViewOnStateChange\n", JSON.stringify(stateChange));
        switch (stateChange.requestType) {
            case "DELETE":
                return this.simpleRow.update(stateChange.data, "DELETE");
            case "CREATE":
                return this.simpleRow.update(stateChange.data, "CREATE");
            case "UPDATE":
                return this.simpleRow.update(stateChange.data);
            default:
                console.warn(`ElasticSimpleListComponent delegating view update to super for ${stateChange.requestType}`)
                return super.updateViewOnStateChange(stateChange);
        }
    }
}