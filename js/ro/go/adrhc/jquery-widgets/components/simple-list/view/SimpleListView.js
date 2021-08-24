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
     * @param {SimpleListOptions} options are the programmatically (javascript) passed options
     * @param {SimpleListConfiguration} config is the component's configuration
     * @return {SimpleListView}
     */
    static of(options, config) {
        const mustacheTableElemAdapter = options.mustacheTableElemAdapter ??
            new MustacheTableElemAdapter(options.elemIdOrJQuery, config);
        return new SimpleListView(mustacheTableElemAdapter);
    }
}