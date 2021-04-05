/**
 * Able to re-render on "all" items update.
 */
class SimpleListView extends AbstractTableBasedView {
    /**
     * @param stateChange {StateChange}
     */
    update(stateChange) {
        AssertionUtils.isTrue($.isArray(stateChange.stateOrPart), "SimpleListView.update accepts only Array!");
        const items = stateChange.stateOrPart.map(it => _.defaults({}, it, {owner: this.owner}));
        this.tableAdapter.renderBodyWithTemplate({items});
        return Promise.resolve(stateChange);
    }
}