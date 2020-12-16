class SelectableListView extends SimpleListView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param notSelectedRow {IdentifiableRowComponent}
     * @param selectedRow {IdentifiableRowComponent}
     */
    constructor(mustacheTableElemAdapter, notSelectedRow, selectedRow) {
        super(mustacheTableElemAdapter);
        this.swappingRowSelector = {
            false: selectedRow,
            true: notSelectedRow
        };
    }

    get notSelectedRow() {
        return this.swappingRowSelector[true];
    }

    /**
     * @param swappingStateChange
     * @return {Promise<StateChange>}
     * @protected
     */
    updateViewOnSwapping(swappingStateChange) {
        const swappingDetails = swappingStateChange.data;
        const swappingData = swappingDetails.data;
        if (swappingData.item) {
            return this._rowComponentOf(swappingStateChange).update(swappingData.item);
        } else {
            return Promise.resolve(swappingStateChange);
        }
    }

    /**
     * Selects the row to display based on swappingDetails.isPrevious and swappingDetails.swappingData.context.
     *
     * @param swappingStateChange {StateChange}
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _rowComponentOf(swappingStateChange) {
        const swappingDetails = swappingStateChange.data;
        const swappingData = swappingDetails.data;
        if (!swappingDetails.isPrevious && swappingData.context) {
            return this.swappingRowSelector[swappingData.context];
        } else {
            return this.swappingRowSelector[swappingDetails.isPrevious];
        }
    }
}