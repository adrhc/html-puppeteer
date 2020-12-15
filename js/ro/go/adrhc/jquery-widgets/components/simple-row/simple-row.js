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
     * @param itemIsRemoved {boolean|undefined}
     * @return {Promise<SimpleRowStateChange>}
     */
    update(item, itemIsRemoved) {
        this.state.update(item, itemIsRemoved);
        return this.view.update(this.state.consumeOne());
    }
}