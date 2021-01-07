class SimpleRowComponent extends AbstractComponent {
    /**
     * @type {SimpleRowState}
     */
    simpleRowState;
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;

    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
        this.simpleRowState = state;
        this.simpleRowView = view;
    }

    /**
     * Updates the state then the view based on state changes.
     *
     * @param item
     * @param requestType {"CREATE"|"UPDATE"}
     * @param afterItemId {number|string}
     * @return {Promise<StateChange[]>}
     */
    update(item, requestType = "UPDATE", afterItemId) {
        const stateChange = new PositionStateChange(requestType, item, afterItemId);
        return this.process(stateChange);
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnDELETE(stateChange) {
        this.close(); // kids also closed
        this.simpleRowView.deleteRowByDataId(stateChange.data.id);
        return Promise.resolve(stateChange);
    }

    /**
     * kids can be initialized because the parent state exists
     *
     * @param positionStateChange {PositionStateChange}
     * @return {Promise<StateChange[]>}
     */
    process(positionStateChange) {
        return this.doWithState((simpleRowState) => {
            simpleRowState.update(positionStateChange.data, positionStateChange.requestType, positionStateChange.afterItemId);
        }).then(stateChanges => this.initKids().then(() => stateChanges));
    }
}