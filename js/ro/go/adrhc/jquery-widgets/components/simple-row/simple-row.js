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
     * @param requestType {"CREATE"|"DELETE"|"UPDATE"}
     * @return {Promise<StateChange>}
     */
    update(item, requestType = "UPDATE") {
        this.state.update(item, requestType);
        return this.updateViewOnStateChange();
    }

    updateViewOnDELETE(stateChange) {
        const updatedRowState = stateChange.data;
        this.tableAdapter.deleteRowByDataId(updatedRowState.id);
        return Promise.resolve(stateChange);
    }
}