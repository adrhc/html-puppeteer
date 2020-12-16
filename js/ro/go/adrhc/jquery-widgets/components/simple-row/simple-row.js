class SimpleRowComponent extends AbstractTableBasedComponent {
    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(view);
        this.state = state;
    }

    /**
     * @param item
     * @param requestType {"CREATE"|"DELETE"|"UPDATE"|undefined}
     * @return {Promise<StateChange>}
     */
    update(item, requestType) {
        this.state.update(item, requestType);
        return this.view.update(this.state.consumeOne());
    }
}