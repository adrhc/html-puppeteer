/**
 * Able to re-render on "all" items update.
 */
class SimpleListView extends MustacheTableBasedView {
    /**
     * @param {Object} params
     * @param {MustacheTableElemAdapter=} params.mustacheTableElemAdapter
     * @param {string=} params.elemIdOrJQuery
     * @param {SimpleListConfiguration=} params.simpleListConfiguration
     */
    constructor({mustacheTableElemAdapter, elemIdOrJQuery, simpleListConfiguration}) {
        super(mustacheTableElemAdapter ??
            new MustacheTableElemAdapter(elemIdOrJQuery, simpleListConfiguration));
    }

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