/**
 * A SimpleListComponent able to accept item-level state changes and updating the view at row level.
 * Uses a SimpleRow to render the updated items.
 */
class ElasticSimpleListComponent extends SimpleListComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {CrudListState}
     * @param view {SimpleListView}
     * @param simpleRowFactoryFn {function}
     */
    constructor(mustacheTableElemAdapter, repository, state, view, simpleRowFactoryFn) {
        super(mustacheTableElemAdapter, repository, state, view);
        this.simpleRowFactoryFn = simpleRowFactoryFn;
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
     * @param stateChanges {StateChange[]|undefined} used to update the view otherwise use state.consumeAll()
     * @return {Promise<StateChange[]>}
     */
    updateOnStateChanges(stateChanges) {
        stateChanges = stateChanges ? stateChanges : this.state.consumeAll();
        const promises = [];
        stateChanges
            .forEach(stateChange => {
                console.log("ElasticSimpleListComponent.updateView\n", JSON.stringify(stateChange));
                switch (stateChange.requestType) {
                    case "UPDATE_ALL":
                        promises.push(super.updateOnStateChange(stateChange));
                        break;
                    case "DELETE":
                        promises.push(this.simpleRowFactoryFn().update(stateChange.state, true));
                        break;
                    case "INSERT":
                    case "UPDATE":
                        promises.push(this.simpleRowFactoryFn().update(stateChange.state));
                        break;
                    default:
                        console.warn(`won't updateView for ${stateChange.requestType}`)
                }
            });
        return Promise.allSettled(promises).then(() => stateChanges);
    }
}