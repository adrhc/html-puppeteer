/**
 * A SimpleListComponent able to accept item-level state changes then updating the view at row level.
 * Uses a SimpleRow to render the updated items (aka rows).
 */
class ElasticSimpleListComponent extends SimpleListComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param simpleRow {SimpleRow}
     */
    constructor(mustacheTableElemAdapter, repository, state, view, simpleRow) {
        super(mustacheTableElemAdapter, repository, state, view);
        this.simpleRow = simpleRow;
    }

    /**
     * @param stateUpdaterFn {function} receives a state {CrudListState} to update
     * @param delayViewUpdate {boolean} whether to (immediately) update the view based on state changes or not
     * @return {Promise<StateChange[]>}
     */
    doWithState(stateUpdaterFn, delayViewUpdate) {
        console.log("ElasticSimpleListComponent.doWithState: delayViewUpdate=", delayViewUpdate);
        stateUpdaterFn(this.state);
        if (delayViewUpdate) {
            return Promise.resolve(this.state.stateChanges.peekAll());
        }
        return this.updateOnStateChanges();
    }

    /**
     * @param stateChanges {StateChange[]|undefined} (delayed state changes) used to update the view otherwise use state.consumeAll()
     * @return {Promise<StateChange[]>}
     */
    updateOnStateChanges(stateChanges) {
        stateChanges = stateChanges ? stateChanges : this.state.consumeAll();
        const promises = [];
        stateChanges
            .forEach(stateChange => {
                promises.push(this.updateOnStateChange(stateChange));
            });
        return Promise.allSettled(promises).then(() => stateChanges);
    }

    updateOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        console.log("ElasticSimpleListComponent.updateOnStateChange\n", JSON.stringify(stateChange));
        switch (stateChange.requestType) {
            case "DELETE":
                return this.simpleRow.update(stateChange.state, "DELETE");
            case "CREATE":
                return this.simpleRow.update(stateChange.state, "CREATE");
            case "UPDATE":
                return this.simpleRow.update(stateChange.state);
            default:
                console.warn(`ElasticSimpleListComponent delegating view update to super for ${stateChange.requestType}`)
                return super.updateOnStateChange(stateChange);
        }
    }
}