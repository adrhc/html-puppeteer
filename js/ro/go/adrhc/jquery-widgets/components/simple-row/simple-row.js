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
     * @param itemIsDueToRemove {boolean|undefined}
     * @return {Promise<SimpleRowStateChange>}
     */
    update(item, itemIsDueToRemove) {
        this.state.update(item, itemIsDueToRemove);
        return this.view.update(this.state.consumeOne());
    }
}