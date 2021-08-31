/**
 * Able to re-render on "all" items update.
 */
class SimpleListView extends MustacheTableBasedView {
    /**
     * @param {Object} options
     * @param {MustacheTableElemAdapter=} [options.mustacheTableElemAdapter]
     * @param {{}=} options.restOfOptions
     */
    constructor({mustacheTableElemAdapter, ...restOfOptions}) {
        super(mustacheTableElemAdapter ?? new MustacheTableElemAdapter(restOfOptions));
    }

    /**
     * @param stateChange {StateChange}
     */
    update(stateChange) {
        AssertionUtils.isTrue($.isArray(stateChange.newStateOrPart), "SimpleListView.update accepts only Array!");
        const items = stateChange.newStateOrPart.map(it => _.defaults({}, it, {[`${JQueryWidgetsConfig.OWNER_ATTRIBUTE}`]: this.owner}));
        this.mustacheTableElemAdapter.renderBodyWithTemplate({items});
        return Promise.resolve(stateChange);
    }
}