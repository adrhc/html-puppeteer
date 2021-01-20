/**
 * Able to re-render on "all" items update.
 */
class SimpleListView extends AbstractTableBasedView {
    /**
     * @param stateChange {StateChange}
     */
    update(stateChange) {
        this.tableAdapter.renderBodyWithTemplate({items: stateChange.data});
        return Promise.resolve(stateChange);
    }
}