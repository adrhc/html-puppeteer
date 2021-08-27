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

    /**
     * @param {SimpleListOptions} simpleListOptions are the programmatically (javascript) passed options
     * @return {SimpleListView}
     */
    static of(simpleListOptions) {
        const mustacheTableElemAdapter = simpleListOptions.mustacheTableElemAdapter ??
            new MustacheTableElemAdapter(simpleListOptions.elemIdOrJQuery, simpleListOptions.config);
        return new SimpleListView(mustacheTableElemAdapter);
    }
}