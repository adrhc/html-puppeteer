/**
 * A SimpleListComponent capable of updating the view based on item-level state changes.
 * Uses a SimpleRow to update the changed item.
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
     * @return {Promise<>}
     */
    doWithState(stateUpdaterFn, delayViewUpdate) {
        console.log("ElasticSimpleListComponent.doWithState: delayViewUpdate=", delayViewUpdate);
        stateUpdaterFn(this.state);
        if (delayViewUpdate) {
            return Promise.resolve();
        }
        this.updateView();
    }

    updateView() {
        const stateChanges = this.state.consumeAll()
        const promises = [];
        stateChanges
            .forEach(stateChange => {
                console.log("ElasticSimpleListComponent.updateView\n", JSON.stringify(stateChange));
                promises.push(this.simpleRow.update(stateChange.state));
            });
        return Promise.allSettled(promises).then(() => stateChanges);
    }
}