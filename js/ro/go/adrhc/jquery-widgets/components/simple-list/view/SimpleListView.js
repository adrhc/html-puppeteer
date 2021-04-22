/**
 * Able to re-render on "all" items update.
 */
class SimpleListView extends MustacheTableBasedView {
    /**
     * @param stateChange {StateChange}
     */
    update(stateChange) {
        AssertionUtils.isTrue($.isArray(stateChange.stateOrPart), "SimpleListView.update accepts only Array!");
        const items = stateChange.stateOrPart.map(it => _.defaults({}, it, {[`${JQueryWidgetsConfig.OWNER_ATTRIBUTE}`]: this.owner}));
        this.mustacheTableElemAdapter.renderBodyWithTemplate({items});
        return Promise.resolve(stateChange);
    }
}