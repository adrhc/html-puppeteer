class SimpleRow extends AbstractTableBasedComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(mustacheTableElemAdapter, state, view) {
        super(mustacheTableElemAdapter, view);
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