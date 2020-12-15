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
     * @return {Promise<SimpleRowStateChange>}
     */
    update(item) {
        this.state.update(item);
        return this.view.update(this.state.consumeOne());
    }
}