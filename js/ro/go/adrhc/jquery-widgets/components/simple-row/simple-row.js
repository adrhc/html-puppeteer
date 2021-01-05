class SimpleRowComponent extends AbstractTableBasedComponent {
    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
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

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnDELETE(stateChange) {
        this.close();
        this.tableAdapter.deleteRowByDataId(stateChange.data.id);
        return Promise.resolve(stateChange);
    }

    close() {
        AbstractComponent.prototype.close.bind(this)();
    }
}