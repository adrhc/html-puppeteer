class SimpleRow extends AbstractTableComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(mustacheTableElemAdapter, state, view) {
        super(mustacheTableElemAdapter, state, view);
    }

    /**
     * @param item
     */
    update(item,) {
        this.state.update(item);
        this.view.update(this.state.consumeStateChange());
    }
}