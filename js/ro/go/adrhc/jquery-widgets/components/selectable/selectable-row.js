class SelectableRow extends AbstractTableComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param state {SelectableState}
     * @param view {SelectableRowView}
     */
    constructor(mustacheTableElemAdapter, state, view) {
        super(mustacheTableElemAdapter, state, view);
    }

    /**
     * @param select {boolean}
     * @param item
     */
    select(select, item) {
        this.state.update(select, item);
        this.view.update(this.state.consumeStateChange());
    }
}