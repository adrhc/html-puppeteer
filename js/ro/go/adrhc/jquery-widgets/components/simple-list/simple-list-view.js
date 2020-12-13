class SimpleListView extends AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        super(mustacheTableElemAdapter);
    }

    /**
     * @param stateChange {StateChange}
     */
    update(stateChange) {
        this.mustacheTableElemAdapter.renderBody({items: stateChange.state});
        return Promise.resolve(stateChange);
    }
}