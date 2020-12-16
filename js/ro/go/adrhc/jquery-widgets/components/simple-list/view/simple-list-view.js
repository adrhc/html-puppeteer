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
        this.tableAdapter.renderBodyWithTemplate({items: stateChange.data});
        return Promise.resolve(stateChange);
    }
}