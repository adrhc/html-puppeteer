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
     * @param rowStateIsRemoved {boolean|undefined}
     * @param rowStateIsCreated {boolean|undefined}
     * @return {Promise<SimpleRowStateChange>}
     */
    update(item, {rowStateIsRemoved, rowStateIsCreated}) {
        this.state.update(item, {rowStateIsRemoved, rowStateIsCreated});
        return this.view.update(this.state.consumeOne());
    }
}