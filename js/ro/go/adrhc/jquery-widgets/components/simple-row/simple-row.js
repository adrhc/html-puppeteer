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
     * @param action {"CREATE"|"DELETE"|"UPDATE"|undefined}
     * @return {Promise<SimpleRowStateChange>}
     */
    update(item, action) {
        this.state.update(item, action);
        return this.view.update(this.state.consumeOne());
    }
}