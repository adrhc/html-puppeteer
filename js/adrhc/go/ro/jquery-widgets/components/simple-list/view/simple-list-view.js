class SimpleListView extends AbstractTableView {
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
        if (!this.supports(stateChange)) {
            return Promise.reject(stateChange);
        }
        this.mustacheTableElemAdapter.renderBody({items: stateChange.state});
        return Promise.resolve(stateChange);
    }

    /**
     * @param stateChange {StateChange}
     */
    supports(stateChange) {
        return stateChange.operation === "UPDATE";
    }
}