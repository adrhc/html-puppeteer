class SimpleRowComponent extends AbstractTableBasedComponent {
    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
        this.state = state;
    }

    /**
     * Updates the state then the view based on state changes.
     *
     * @param item
     * @param requestType {"CREATE"|"UPDATE"}
     * @param afterItemId {number|string}
     * @return {Promise<StateChange>}
     */
    update(item, requestType = "UPDATE", afterItemId) {
        this.state.update(item, requestType, afterItemId);
        return this.updateViewOnStateChange();
    }

    updateViewOnDELETE(stateChange) {
        const updatedRowState = stateChange.data;
        this.tableAdapter.deleteRowByDataId(updatedRowState.id);
        return Promise.resolve(stateChange);
    }
}