class DrawingComponent extends ContainerComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {ComponentConfiguration} [config]
     * @param {ContainerState} [state]
     * @param {DefaultTemplatingView} [view]
     */
    constructor(elemIdOrJQuery,
                config = $.extend(new ComponentConfiguration(),
                    {clearChildrenOnReset: true}, DomUtils.jQueryOf(elemIdOrJQuery).data()),
                state, view) {
        super(elemIdOrJQuery, config);
    }

    processStateChanges(stateChangeOrJustData, {dontRecordStateEvents}) {
        super.reset();
        return super.processStateChanges(stateChangeOrJustData, {dontRecordStateEvents});
    }
}