/**
 * Able to re-render on "all" items update.
 */
class SimpleListView extends AbstractTableBasedView {
    /**
     * @param stateChange {StateChange}
     */
    update(stateChange) {
        AssertionUtils.isTrue($.isArray(stateChange.stateOrPart), "SimpleListView.update accepts only Array!");
        this.tableAdapter.renderBodyWithTemplate({items: stateChange.stateOrPart});
        return Promise.resolve(stateChange);
    }
}